import { Injectable } from '@nestjs/common';
import { add } from 'date-fns';
import { POST_DELETION_COOLDOWN_SECONDS } from 'src/config';
import { BoardCache } from 'src/modules/board/board.cache';
import { hashPassword } from 'src/utils';
import { CommandResponse } from 'src/utils/models/command-response';
import { PrismaService } from '../../prisma';
import { DeletePostDto } from './delete-post.dto';
import { DeletePostResult } from './delete-post.result';

@Injectable()
export class DeletePostService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly boardCache: BoardCache,
  ) {}

  async deletePosts(
    dto: DeletePostDto,
  ): Promise<CommandResponse<DeletePostResult>> {
    const postsToDelete = await this.prisma.post.findMany({
      where: {
        boardId: dto.boardId,
        id: { in: dto.postsIds },
      },
    });

    if (postsToDelete.length !== dto.postsIds.length) {
      return new CommandResponse(DeletePostResult.POST_NOT_FOUND);
    }

    const passwordMatches = postsToDelete.every(
      (post) => post.passwordHash === hashPassword(dto.password),
    );

    if (!passwordMatches) {
      return new CommandResponse(DeletePostResult.INVALID_PASSWORD);
    }

    const cooldownDate = add(new Date(), {
      seconds: -POST_DELETION_COOLDOWN_SECONDS,
    });
    const hasCooldown = postsToDelete.some(
      (post) => cooldownDate < post.createdAt,
    );

    if (hasCooldown) {
      return new CommandResponse(DeletePostResult.TOO_EARLY);
    }

    try {
      await this.prisma.$transaction(async (prisma) => {
        // Delete backlinks connected with post (and its replies if post is a thread)
        await prisma.postBacklink.deleteMany({
          where: {
            OR: [
              {
                linkedByBoardId: dto.boardId,
                linkedById: { in: dto.postsIds },
              },
              {
                postBoardId: dto.boardId,
                postId: { in: dto.postsIds },
              },
              {
                post: {
                  parent: {
                    boardId: dto.boardId,
                    id: { in: dto.postsIds },
                  },
                },
              },
              {
                linkedBy: {
                  parent: {
                    boardId: dto.boardId,
                    id: { in: dto.postsIds },
                  },
                },
              },
            ],
          },
        });

        // Delete posts (and replies, if deleted post is a thread)
        await prisma.post.deleteMany({
          where: {
            OR: [
              {
                boardId: dto.boardId,
                id: { in: dto.postsIds },
              },
              {
                parent: {
                  boardId: dto.boardId,
                  id: { in: dto.postsIds },
                },
              },
            ],
          },
        });
      });

      this.boardCache.clearBoardCache(dto.boardId);

      return new CommandResponse(DeletePostResult.OK);
    } catch (err) {
      return new CommandResponse(DeletePostResult.UNKNOWN_ERROR);
    }
  }
}
