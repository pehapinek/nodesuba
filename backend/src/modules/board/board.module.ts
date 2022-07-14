import { Module } from '@nestjs/common';
import { BoardCache } from './board.cache';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';

@Module({
  providers: [BoardService, BoardCache],
  controllers: [BoardController],
})
export class BoardModule {}
