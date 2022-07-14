import { Controller, Get, NotImplementedException, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BanService } from './ban.service';

@ApiTags('ban')
@Controller('ban')
export class BanController {
  constructor(private readonly banService: BanService) {}

  @Get('info')
  @ApiOperation({ summary: 'Returns a ban info by user IP' })
  async banInfo() {
    return new NotImplementedException();
  }

  @Post('appeal')
  @ApiOperation({ summary: 'Submits an appeal' })
  async submitAppeal() {
    return new NotImplementedException();
  }
}
