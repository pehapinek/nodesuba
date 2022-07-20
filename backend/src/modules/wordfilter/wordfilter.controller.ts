import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateWordfilterDto } from './create-wordfilter.dto';
import { WordfilterService } from './wordfilter.service';

@ApiTags('wordfilters')
@Controller('wordfilters')
export class WordfilterController {
  constructor(private readonly wordfilterService: WordfilterService) {}

  @Post()
  @ApiOperation({ summary: 'Creates a wordfilter' })
  @ApiCreatedResponse({ description: 'Wordfilter created' })
  async createWordfilter(@Body() dto: CreateWordfilterDto) {
    const wordfilter = await this.wordfilterService.createWordfilter(dto);

    return wordfilter;
  }
}
