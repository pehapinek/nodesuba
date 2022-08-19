import { Module } from '@nestjs/common';
import { WordfilterService } from './wordfilter.service';
import { WordfilterController } from './wordfilter.controller';

@Module({
  providers: [WordfilterService],
  controllers: [WordfilterController],
})
export class WordfilterModule {}
