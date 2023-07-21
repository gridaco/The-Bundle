import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import { nanoid } from 'nanoid';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { DMTRequest, render } from '../dmt';
import * as sharp from 'sharp';
import { upscale2x } from '../upscale/api';

const S3 = new S3Client({});
const DEV = process.env.NODE_ENV !== 'production';
const BUCKET = DEV ? 'dev-dmt-out' : 'dmt-out';

@Injectable()
export class TemplatesService {
  async renderStill(templateId: string, request: DMTRequest) {
    const { data, config } = request;
    const res = await render(templateId, {
      data,
      config,
    });

    // upload to s3
    const key = nanoid();
    const key_1x = `${key}.png`;
    const key_2x = `${key}@2x.png`;

    const uploads = [];

    // non upscaled image
    const up1 = S3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key_1x,
        Body: await fs.readFile(res.still),
        ACL: 'public-read',
      }),
    );
    uploads.push(up1);

    if (!res.transparent) {
      // if not transparent, apply upscaler
      // TODO: if resolition px exceeds, skip.
      try {
        const bg_added = await addBackgroundColor(res.still, black);
        const upscaled = await upscale2x(bg_added);
        const up2 = S3.send(
          new PutObjectCommand({
            Bucket: BUCKET,
            Key: key_2x,
            ContentType: 'image/png',
            Body: Buffer.from(upscaled.base64, 'base64'),
            ACL: 'public-read',
          }),
        );
        uploads.push(up2);
      } catch (e) {
        console.error(e);
      }
    }

    // wait for uploads to finish
    const results = await Promise.all(uploads);

    const url_1x =
      results[0] && `https://dev-dmt-out.s3.us-west-1.amazonaws.com/${key_1x}`;
    const url_2x =
      results[1] && `https://dev-dmt-out.s3.us-west-1.amazonaws.com/${key_2x}`;

    return {
      still: url_1x,
      still_2x: url_2x,
    };
  }

  findAll() {
    return `This action returns all templates`;
  }

  findOne(id: string) {
    return `This action returns a #${id} template`;
  }
}

const black = {
  r: 0,
  g: 0,
  b: 0,
};

async function addBackgroundColor(
  file: string | Buffer,
  background: {
    r: number;
    g: number;
    b: number;
  } = black,
): Promise<Buffer> {
  return await sharp(file)
    .flatten({ background: background })
    .jpeg()
    .toBuffer();
}
