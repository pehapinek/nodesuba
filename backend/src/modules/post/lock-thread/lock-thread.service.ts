import { Injectable } from '@nestjs/common';
import { IAnonUser } from '../../../utils/decorators/anon-user.interface';
import { CommandResponse } from '../../../utils/models/command-response';
import { PrismaService } from '../../prisma';
import { LockThreadDto } from './lock-thread.dto';
import { LockThreadResult } from './lock-thread.result';

@Injectable()
export class LockThreadService {
  constructor(private readonly prisma: PrismaService) {}

  async lockThread(
    dto: LockThreadDto,
  ): Promise<CommandResponse<LockThreadResult>> {
    const thread = await this.prisma.post.findUnique({
      where: {
        boardId_id: {
          boardId: dto.boardId,
          id: dto.postId,
        },
      },
    });

    if (!thread || thread?.parentGuid) {
      return new CommandResponse(LockThreadResult.THREAD_NOT_FOUND);
    }

    try {
      await this.prisma.post.update({
        where: {
          boardId_id: {
            boardId: dto.boardId,
            id: dto.postId,
          },
        },
        data: {
          isLocked: dto.lock,
        },
      });

      return new CommandResponse(LockThreadResult.OK);
    } catch (err) {
      return new CommandResponse(LockThreadResult.UNKNOWN_ERROR);
    }
  }
}
