import { Module } from '@nestjs/common';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';

@Module({
  providers: [BoardService],
  controllers: [BoardController],
})
export class BoardModule {}
