import { Injectable } from '@nestjs/common';
import { upscale2x } from '../upscale/api';

@Injectable()
export class UtilityService {
  async upscale2x() {
    // TODO: add file
    const result = await upscale2x('');

    return result;
  }
}
