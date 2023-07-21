import { Module } from '@nestjs/common';
import { UtilityService } from './utility.service';
import { UtilityController } from './utility.controller';

@Module({
  controllers: [UtilityController],
  providers: [UtilityService],
})
export class UtilitysModule {}
