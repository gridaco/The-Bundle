import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UtilityService } from './utility.service';
import { DMTRequest } from '../dmt';

@Controller('utility')
export class UtilityController {
  constructor(private readonly templatesService: UtilityService) {}

  @Post('upscale/2x')
  // TODO: multiple body params
  upscale2x() {
    // return this.templatesService.renderStill(id, body);
  }
}
