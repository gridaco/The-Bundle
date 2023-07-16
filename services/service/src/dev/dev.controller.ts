import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DevService } from './dev.service';
@Controller('dev')
export class DevController {
  constructor(private readonly service: DevService) {}

  @Post('render/sample')
  create(@Body() renderRequest: { data: any }) {
    return this.service.create(renderRequest);
  }
}
