import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import { nanoid } from 'nanoid';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { render } from '../dmt';

const S3 = new S3Client({});
const DEV = process.env.NODE_ENV !== 'production';
const BUCKET = DEV ? 'dev-dmt-out' : 'dmt-out';

@Injectable()
export class TemplatesService {
  async renderStill(templateId: string, request: { data: any }) {
    const { data } = request;
    const res = await render(templateId, data);
    // upload to s3
    const key = `${nanoid()}.png`;
    await S3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: await fs.readFile(res.still),
        ACL: 'public-read',
      }),
    );

    const url = `https://dev-dmt-out.s3.us-west-1.amazonaws.com/${key}`;

    return {
      still: url,
    };
  }

  findAll() {
    return `This action returns all templates`;
  }

  findOne(id: string) {
    return `This action returns a #${id} template`;
  }
}
