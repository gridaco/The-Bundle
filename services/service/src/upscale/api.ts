import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import axios from 'axios';
import * as FormData from 'form-data';
import * as fs from 'fs';

const STABILITYAI_API_KEY = process.env.STABILITYAI_API_KEY;

/**
 * Response when requested with application/json
 */
export interface UpscaleApiJsonResponse {
  artifacts: ReadonlyArray<UpscaleApiArtifact>;
}

export interface UpscaleApiArtifact {
  /**
   * Image encoded in base64
   */
  base64: string;
  /**
   * The seed associated with this image
   */
  seed: number;
  finishReason: 'CONTENT_FILTERED' | 'ERROR' | 'SUCCESS';
}

/**
 * Upscales an image 2x using the ESRGAN model. - uses api.stability.ai
 * upscale2x('path-to-image', 'path-to-output')
 *
 * requires API key
 *
 * The api comes with two response modes, application/json and image/png. - this function only supports application/json
 *
 * @param input path to input image
 * @param save path to save image - if not provided, will not write to disk
 */
export async function upscale2x(
  input: string | Buffer,
  save?: string,
): Promise<
  UpscaleApiArtifact & {
    save?: string;
  }
> {
  // NOTE: This example is using a NodeJS FormData library.
  // Browsers should use their native FormData class.
  // React Native apps should also use their native FormData class.
  const formData = new FormData();

  if (typeof input === 'string') {
    formData.append('image', fs.createReadStream(input));
  } else if (input instanceof Buffer) {
    formData.append('image', input);
  }

  const config = {
    headers: {
      ...formData.getHeaders(),
      Accept: 'application/json',
      Authorization: `Bearer ${STABILITYAI_API_KEY}`,
    },
  };

  const response = await axios.post<UpscaleApiJsonResponse>(
    'https://api.stability.ai/v1/generation/esrgan-v1-x2plus/image-to-image/upscale',
    formData,
    config,
  );

  const result = response.data.artifacts[0];

  switch (result.finishReason) {
    case 'CONTENT_FILTERED': {
      throw new BadRequestException('Image was filtered out');
    }
    case 'ERROR': {
      throw new InternalServerErrorException('Upscaler failed');
    }
    case 'SUCCESS': {
      if (save) {
        fs.writeFileSync(save, Buffer.from(result.base64, 'base64'));
        return {
          ...result,
          save: save,
        };
      }

      return result;
    }
  }
}
