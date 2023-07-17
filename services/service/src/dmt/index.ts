import * as tmp from 'tmp';
import * as fs from 'fs/promises';
import * as path from 'path';
import { spawn } from 'child_process';

// Define the Python script path and its arguments
const repo_root_path = path.resolve(__dirname, '..', '..', '..', '..');
const dmt_path = path.resolve(repo_root_path, 'dmt');
const templates_path = path.resolve(repo_root_path, 'templates');
const exe = path.resolve(dmt_path, 'src', 'cli.py');

interface DMTResult {
  still: string;
}

export function render(templateId: string, data: any): Promise<DMTResult> {
  return new Promise(async (resolve, reject) => {
    // create json requests as file
    const data_file = tmp.fileSync();

    // create tmp output dir
    const out_dir = tmp.dirSync();
    // dmt requires trailing slash
    const out_dir_name = out_dir.name + '/';

    // write data to file
    await fs.writeFile(data_file.name, JSON.stringify(data));

    // e.g.
    // sudo python3 src/cli.py -t '//templates/003-3d-glass-dispersion-text' -d '//templates/003-3d-glass-dispersion-text/presets/default.json' -o '//out/'
    const template = path.resolve(templates_path, templateId);

    const args = [
      // template
      '--template',
      template,
      // data
      '--data',
      data_file.name,
      // output
      '--out',
      out_dir_name,
    ];

    const txt = ['python3', exe, ...args].join(' ');
    const pythonProcess = spawn('python3', [exe, ...args]);

    console.log({
      exe,
      data_file: data_file.name,
      out_dir_name,
      template,
      txt,
    });

    // proxy log
    // pythonProcess.stdout.on('data', (data) => {
    //   console.log(data.toString());
    // });

    pythonProcess.on('exit', async (code) => {
      switch (code) {
        case 0: {
          // const result_raw = await fs.readFile(
          //   path.resolve(out_dir_name, 'output.json'),
          // );
          // const result = JSON.parse(result_raw.toString());

          const still = path.resolve(out_dir_name, '.png');

          resolve({
            // ...result,
            still,
          });
          return;
        }
        case 1: {
          reject(new Error('DMT failed with code 1'));
          return;
        }
        case 2: {
          reject(new Error('DMT failed with code 2'));
          return;
        }
        default: {
          reject(new Error(`DMT failed with code ${code}`));
          return;
        }
      }
    });
  });
}
