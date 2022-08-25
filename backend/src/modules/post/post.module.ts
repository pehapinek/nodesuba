import { Module } from '@nestjs/common';
import { BanModule } from '../ban/ban.module';
import { BoardCache } from '../board/board.cache';
import { CreatePostService } from './create-post/create-post.service';
import { DeletePostService } from './delete-post/delete-post.service';
import { LockThreadService } from './lock-thread/lock-thread.service';
import { PostController } from './post.controller';
import { ReportPostService } from './report-post/report-post.service';

@Module({
  imports: [BanModule],
  providers: [
    CreatePostService,
    DeletePostService,
    ReportPostService,
    LockThreadService,
    BoardCache,
  ],
  controllers: [PostController],
})
export class PostModule {}
