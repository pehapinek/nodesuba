import {
  Body,
  ConflictException,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  GoneException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  NotImplementedException,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiGoneResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AnonUser } from '../../utils/decorators/anon-user.decorator';
import { IAnonUser } from '../../utils/decorators/anon-user.interface';
import { CreatePostDto } from './create-post/create-post.dto';
import { CreatePostResult } from './create-post/create-post.result';
import { CreatePostService } from './create-post/create-post.service';
import { DeletePostDto } from './delete-post/delete-post.dto';
import { DeletePostResult } from './delete-post/delete-post.result';
import { DeletePostService } from './delete-post/delete-post.service';
import { LockThreadDto } from './lock-thread/lock-thread.dto';
import { LockThreadResult } from './lock-thread/lock-thread.result';
import { LockThreadService } from './lock-thread/lock-thread.service';
import { ReportPostDto } from './report-post/report-post.dto';
import { ReportPostResult } from './report-post/report-post.result';
import { ReportPostService } from './report-post/report-post.service';

@ApiTags('post')
@Controller('post')
export class PostController {
  constructor(
    private readonly createPostService: CreatePostService,
    private readonly deletePostService: DeletePostService,
    private readonly reportPostService: ReportPostService,
    private readonly lockThreadService: LockThreadService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Creates a post' })
  @ApiCreatedResponse({ description: 'Post created' })
  @ApiNotFoundResponse({ description: 'Board not found' })
  @ApiConflictResponse({ description: 'User is banned' })
  @ApiGoneResponse({ description: 'Thread not found' })
  @ApiResponse({ status: 452, description: 'Thread is locked' })
  async createPost(
    @Body() dto: CreatePostDto,
    @AnonUser() anonUser: IAnonUser,
  ) {
    const result = await this.createPostService.createPost(dto, anonUser);

    switch (result.type) {
      case CreatePostResult.BOARD_NOT_FOUND:
        throw new NotFoundException();
      case CreatePostResult.THREAD_NOT_FOUND:
        throw new GoneException();
      case CreatePostResult.BANNED:
        throw new ConflictException();
      case CreatePostResult.THREAD_LOCKED:
        throw new HttpException(undefined, 452);
      case CreatePostResult.UNKNOWN_ERROR:
        throw new InternalServerErrorException();
    }

    return result.payload;
  }

  @Delete()
  @ApiOperation({ summary: 'Deletes multiple posts by password' })
  @ApiOkResponse({ description: 'Posts deleted successfully' })
  @ApiNotFoundResponse({ description: 'Some posts do not exist' })
  @ApiConflictResponse({
    description: 'Cannot delete some posts because of cooldown',
  })
  async deletePost(@Body() dto: DeletePostDto) {
    const result = await this.deletePostService.deletePosts(dto);

    switch (result.type) {
      case DeletePostResult.INVALID_PASSWORD:
        throw new ForbiddenException();
      case DeletePostResult.POST_NOT_FOUND:
        throw new NotFoundException();
      case DeletePostResult.TOO_EARLY:
        throw new ConflictException();
      case DeletePostResult.UNKNOWN_ERROR:
        throw new InternalServerErrorException();
    }
  }

  @Get('search')
  @ApiOperation({ summary: 'Returns a posts containing the specified keyword' })
  async search(@Query('query') query: string) {
    return new NotImplementedException();
  }

  @Post('report')
  @ApiOperation({ summary: 'Reports a post' })
  @ApiOkResponse({ description: 'Posts reported successfully' })
  @ApiNotFoundResponse({ description: 'Some posts do not exist' })
  @ApiConflictResponse({ description: 'Post already reported' })
  async reportPost(
    @Body() dto: ReportPostDto,
    @AnonUser() anonUser: IAnonUser,
  ) {
    const result = await this.reportPostService.reportPosts(dto, anonUser);

    switch (result.type) {
      case ReportPostResult.POST_NOT_FOUND:
        throw new NotFoundException();
      case ReportPostResult.POST_ALREADY_REPORTED:
        throw new ConflictException();
      case ReportPostResult.UNKNOWN_ERROR:
        throw new InternalServerErrorException();
    }
  }

  @Post('lock')
  @ApiOperation({ summary: 'Locks/unlocks a thread' })
  async lockThread(@Body() dto: LockThreadDto) {
    const result = await this.lockThreadService.lockThread(dto);

    switch (result.type) {
      case LockThreadResult.THREAD_NOT_FOUND:
        throw new NotFoundException();
      case LockThreadResult.UNKNOWN_ERROR:
        throw new InternalServerErrorException();
    }
  }

  @Post('stick')
  @ApiOperation({ summary: 'Sticks/unsticks a thread' })
  async stickThread() {
    return new NotImplementedException();
  }
}
