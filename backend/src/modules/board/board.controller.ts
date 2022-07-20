import {
  Controller,
  Get,
  NotFoundException,
  NotImplementedException,
  Param,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WordfilterInterceptor } from '../wordfilter/wordfilter.interceptor';
import { BoardService } from './board.service';

@UseInterceptors(WordfilterInterceptor)
@ApiTags('board')
@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Get('list')
  @ApiOperation({ summary: 'Returns a list of boards' })
  async list() {
    return await this.boardService.listBoards();
  }

  @Get(':boardId/catalog')
  @ApiOperation({
    summary: 'Returns a list of posts in catalog',
  })
  async catalog() {
    return new NotImplementedException();
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

  @Get(':boardId/preview/:postId')
  @ApiOperation({ summary: 'Returns a preview of a single post' })
  async getPost() {
    return new NotImplementedException();
  }
}
