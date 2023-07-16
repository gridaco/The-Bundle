import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';
import { nanoid } from 'nanoid';
import * as tmp from 'tmp';
import * as fs from 'fs/promises';
import * as path from 'path';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

// Define the Python script path and its arguments
const repo_root_path = path.resolve(__dirname, '..', '..', '..', '..');
const dmt_path = path.resolve(repo_root_path, 'dmt');
const templates_path = path.resolve(repo_root_path, 'templates');
const exe = path.resolve(dmt_path, 'src', 'cli.py');

const S3 = new S3Client({});

@Injectable()
export class DevService {
  create(request: { data: any }) {
    const { data } = request;
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
      const template = path.resolve(
        templates_path,
        '003-3d-glass-dispersion-text',
      );

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
        console.log(`Python script finished with code: ${code}`);
        // const result_raw = await fs.readFile(
        //   path.resolve(out_dir_name, 'output.json'),
        // );
        // const result = JSON.parse(result_raw.toString());

        const still = path.resolve(out_dir_name, '.png');

        // upload to s3
        const key = `${nanoid()}.png`;
        await S3.send(
          new PutObjectCommand({
            Bucket: 'dev-dmt-out',
            Key: key,
            Body: await fs.readFile(still),
            ACL: 'public-read',
          }),
        );

        const url = `https://dev-dmt-out.s3.us-west-1.amazonaws.com/${key}`;

        resolve({
          // ...result,
          still: url,
        });
      });
    });
  }
}
