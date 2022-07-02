import { Module } from '@nestjs/common';
import { BanService } from './ban.service';

@Module({
  providers: [BanService],
  exports: [BanService],
})
export class BanModule {}
