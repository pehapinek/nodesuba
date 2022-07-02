import { Injectable } from '@nestjs/common';
import { BanType } from '@prisma/client';
import { IAnonUser } from '../../utils/decorators/anon-user.interface';
import { PrismaService } from '../prisma';

@Injectable()
export class BanService {
  constructor(private readonly prisma: PrismaService) {}

  async isBanned(anonUser: IAnonUser) {
    const bansCount = await this.prisma.ban.count({
      where: {
        banType: BanType.IP,
        ip: anonUser.ip,
        startsAt: {
          lte: new Date(),
        },
        endsAt: {
          gte: new Date(),
        },
      },
    });

    return bansCount > 0;
  }
}
