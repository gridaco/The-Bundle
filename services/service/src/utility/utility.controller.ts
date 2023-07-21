import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { UtilityService } from './utility.service';
import { DMTRequest } from '../dmt';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('utility')
export class UtilityController {
  constructor(private readonly service: UtilityService) {}

  @Post('upscale/2x')
  @UseInterceptors(FileInterceptor('image'))
  async upscale2x(@UploadedFile() file: Express.Multer.File, @Res() res) {
    const result = await this.service.upscale2x(file);

    const buffer = Buffer.from(result.base64, 'base64');

    res.set({
      'Content-Type': 'image/png',
      'Content-Length': buffer.length,
    });

    res.send(buffer);
  }
}
