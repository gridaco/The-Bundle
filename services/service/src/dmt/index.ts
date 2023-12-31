import * as tmp from 'tmp';
import * as fs from 'fs/promises';
import * as path from 'path';
import { spawn } from 'child_process';

// Define the Python script path and its arguments
const repo_root_path = path.resolve(__dirname, '..', '..', '..', '..');
const dmt_path = path.resolve(repo_root_path, 'dmt');
const templates_path = path.resolve(repo_root_path, 'templates');
const exe = path.resolve(dmt_path, 'src', 'cli.py');
const venv = path.resolve(dmt_path, 'venv');
const python = path.resolve(venv, 'bin', 'python3');
const pythonpath = repo_root_path;

export interface DMTRequest<T = any> {
  data: T;
  config?: DMTConfig;
  request?: {
    format: 'PNG';
    target_object?: string;
    target_collection?: string;
  };
}

export interface DMTConfig {
  resolution_x: number;
  resolution_y: number;
  samples: number;
  engine: 'CYCLES' | 'BLENDER_EEVEE';
}

interface DMTResult {
  still: string;
  transparent?: boolean;
  resolution_x: number;
  resolution_y: number;
}

export function render(
  templateId: string,
  params: DMTRequest,
): Promise<DMTResult> {
  const { data, config } = params;

  return new Promise(async (resolve, reject) => {
    // create json <data> as file
    const data_file = tmp.fileSync();

    // create json <request> as file
    const request_file = tmp.fileSync();

    // create tmp output dir
    const out_dir = tmp.dirSync();
    // dmt requires trailing slash
    const out_dir_name = out_dir.name + '/';

    // write data to file
    await fs.writeFile(data_file.name, JSON.stringify(data));

    // write request to file
    await fs.writeFile(request_file.name, JSON.stringify(params.request || {}));

    // e.g.
    // sudo python3 src/cli.py -t '//templates/003-3d-glass-dispersion-text' -d '//templates/003-3d-glass-dispersion-text/presets/default.json' -o '//out/'
    // const template = path.resolve(templates_path, templateId);
    const template = await locateTemplate(templateId);

    const args = [
      // template
      '--template',
      template,
      // data
      '--data',
      data_file.name,
      // request
      '--request',
      request_file.name,
      // output
      '--out',
      out_dir_name,
      // config
      ...(config ? ['--config', JSON.stringify(config)] : []),
    ];

    const txt = [python, exe, ...args].join(' ');
    const pythonProcess = spawn(python, [exe, ...args], {
      shell: true,
      env: {
        PYTHONPATH: pythonpath,
      },
    });

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

          const still = path.resolve(out_dir_name, 'still.png');

          resolve({
            // ...result,
            still,
            // TODO: update with response from dmt
            resolution_x: 512,
            resolution_y: 512,
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

/**
 * Locates the user-friendly template directory name with the template key
 * E.g. with "004" - this will resolve ~/004-3d-glass-dispersion-text-nueue
 * @param key
 */
async function locateTemplate(
  key: string,
  cwd: string = templates_path,
): Promise<string> {
  // list the templates directory
  const directories = await fs.readdir(cwd);

  // find the template directory
  const template = directories.find((item) => item.startsWith(key));

  if (!template) {
    throw new Error(`Template ${key} not found`);
  }

  return path.resolve(cwd, template);
}
