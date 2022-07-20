import { Module } from '@nestjs/common';
import { WordfilterService } from '../wordfilter/wordfilter.service';
import { BoardCache } from './board.cache';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';

@Module({
  providers: [BoardService, BoardCache, WordfilterService],
  controllers: [BoardController],
})
export class BoardModule {}
