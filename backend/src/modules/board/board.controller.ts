import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BoardService } from './board.service';

@ApiTags('board')
@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Get('list')
  @ApiOperation({ summary: 'Returns a list of boards' })
  async list() {
    return await this.boardService.listBoards();
  }

  @Get(':boardId/page/:page')
  @ApiOperation({
    summary: 'Returns a paginated list of threads with recent replies',
  })
  async paginatePosts(
    @Param('boardId') boardId: string,
    @Param('page', ParseIntPipe) page: number,
  ) {
    return await this.boardService.paginatePosts(boardId, page);
  }

  @Get(':boardId/thread/:postId')
  @ApiOperation({ summary: 'Returns a thread with all replies' })
  async getThread(
    @Param('boardId') boardId: string,
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    const thread = await this.boardService.getThread(boardId, postId);

    if (!thread) {
      throw new NotFoundException();
    }

    return thread;
  }
}
