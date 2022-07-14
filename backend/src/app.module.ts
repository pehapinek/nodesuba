import type { ClientOpts } from 'redis';
import { CacheModule, Module } from '@nestjs/common';
import { BanModule } from './modules/ban/ban.module';
import { BoardModule } from './modules/board/board.module';
import { PostModule } from './modules/post/post.module';
import { PrismaModule } from './modules/prisma';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.register<ClientOpts>({
      store: redisStore,
      host: 'cache',
      port: 6379,
      password: process.env.REDIS_PASS,
      isGlobal: true,
      ttl: 0,
    }),
    BanModule,
    BoardModule,
    PostModule,
    PrismaModule,
  ],
})
export class AppModule {}
