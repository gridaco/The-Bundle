import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { TemplatesService } from './templates.service';

@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Post(':id/render-still')
  renderStill(@Param('id') id: string, @Body() body: { data: any }) {
    return this.templatesService.renderStill(id, body);
  }

  @Get()
  findAll() {
    return this.templatesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.templatesService.findOne(id);
  }
}
