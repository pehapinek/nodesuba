import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { CreateWordfilterDto } from './create-wordfilter.dto';

@Injectable()
export class WordfilterService {
  constructor(private readonly prisma: PrismaService) {}

  async createWordfilter(dto: CreateWordfilterDto) {
    await this.prisma.wordfilter.create({
      data: {
        input: dto.input,
        output: dto.output,
      },
    });

    return {
      input: dto.input,
      output: dto.output,
    };
  }

  async getWordfilters() {
    return this.prisma.wordfilter.findMany();
  }
}
