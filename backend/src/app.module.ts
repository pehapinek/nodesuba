import { Module } from '@nestjs/common';
import { BanModule } from './modules/ban/ban.module';
import { BoardModule } from './modules/board/board.module';
import { PostModule } from './modules/post/post.module';
import { PrismaModule } from './modules/prisma';

@Module({
  imports: [BanModule, BoardModule, PostModule, PrismaModule],
})
export class AppModule {}
