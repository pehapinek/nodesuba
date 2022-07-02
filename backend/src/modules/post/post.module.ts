import { Module } from '@nestjs/common';
import { BanModule } from '../ban/ban.module';
import { CreatePostService } from './create-post/create-post.service';
import { PostController } from './post.controller';

@Module({
  imports: [BanModule],
  providers: [CreatePostService],
  controllers: [PostController],
})
export class PostModule {}
