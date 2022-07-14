import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  GoneException,
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
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AnonUser } from '../../utils/decorators/anon-user.decorator';
import { IAnonUser } from '../../utils/decorators/anon-user.interface';
import { CreatePostDto } from './create-post/create-post.dto';
import { CreatePostResult } from './create-post/create-post.result';
import { CreatePostService } from './create-post/create-post.service';

@ApiTags('post')
@Controller('post')
export class PostController {
  constructor(private readonly createPostService: CreatePostService) {}

  @Post()
  @ApiOperation({ summary: 'Creates a post' })
  @ApiCreatedResponse({ description: 'Post created' })
  @ApiNotFoundResponse({ description: 'Board not found' })
  @ApiConflictResponse({ description: 'User is banned' })
  @ApiGoneResponse({ description: 'Thread not found' })
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
      case CreatePostResult.UNKNOWN_ERROR:
        throw new InternalServerErrorException();
    }

    return result.payload;
  }

  @Delete()
  @ApiOperation({ summary: 'Deletes a post' })
  async deletePost() {
    return new NotImplementedException();
  }

  @Get('search')
  @ApiOperation({ summary: 'Returns a posts containing the specified keyword' })
  async search(@Query('query') query: string) {
    return new NotImplementedException();
  }

  @Post('report')
  @ApiOperation({ summary: 'Reports a post' })
  async reportPost() {
    return new NotImplementedException();
  }

  @Post('lock')
  @ApiOperation({ summary: 'Locks/unlocks a thread' })
  async lockThread() {
    return new NotImplementedException();
  }

  @Post('stick')
  @ApiOperation({ summary: 'Sticks/unsticks a thread' })
  async stickThread() {
    return new NotImplementedException();
  }

  @Get(':boardId/:postId')
  @ApiOperation({ summary: 'Returns a preview of a single post' })
  async previewPost() {
    return new NotImplementedException();
  }
}
