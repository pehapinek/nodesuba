import { Module } from '@nestjs/common';
import { BanModule } from '../ban/ban.module';
import { BoardCache } from '../board/board.cache';
import { CreatePostService } from './create-post/create-post.service';
import { DeletePostService } from './delete-post/delete-post.service';
import { PostController } from './post.controller';

@Module({
  imports: [BanModule],
  providers: [CreatePostService, DeletePostService, BoardCache],
  controllers: [PostController],
})
export class PostModule {}
