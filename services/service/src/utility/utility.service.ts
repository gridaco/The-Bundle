import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { upscale2x } from '../upscale/api';

@Injectable()
export class UtilityService {
  async upscale2x(file: Express.Multer.File) {
    try {
      const result = await upscale2x(file.buffer);

      return result;
    } catch (e) {
      throw new InternalServerErrorException(e.response.data.message);
    }
  }
}
