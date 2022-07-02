import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { hashPassword } from '../../../utils';
import { CommandResponse } from '../../../utils/models/command-response';
import { CreatePostDto } from './create-post.dto';
import { CreatePostResult } from './create-post.result';
import { IAnonUser } from '../../../utils/decorators/anon-user.interface';
import { Post } from '@prisma/client';
import { BanService } from '../../../modules/ban/ban.service';
import { findBacklinks } from '../../../utils/post-tools';

@Injectable()
export class CreatePostService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly banService: BanService,
  ) {}

  async createPost(
    dto: CreatePostDto,
    anonUser: IAnonUser,
  ): Promise<CommandResponse<CreatePostResult>> {
    const board = await this.prisma.board.findUnique({
      where: { id: dto.boardId },
    });

    if (!board) {
      return new CommandResponse(CreatePostResult.BOARD_NOT_FOUND);
    }

    let parentPost: Post = null;

    if (dto.parentId !== undefined) {
      parentPost = await this.prisma.post.findUnique({
        where: {
          boardId_id: {
            boardId: dto.boardId,
            id: dto.parentId,
          },
        },
      });

      if (!parentPost) {
        return new CommandResponse(CreatePostResult.THREAD_NOT_FOUND);
      }
    }

    const backlinks = findBacklinks(dto.boardId, dto.content);
    // TODO: handle backlinks

    const postId = board.postsCounter + 1;

    const transactions = [
      this.prisma.post.create({
        data: {
          id: postId,
          board: {
            connect: { id: dto.boardId },
          },
          parent: parentPost
            ? {
                connect: { guid: parentPost.guid },
              }
            : undefined,
          content: dto.content,
          ip: anonUser.ip,
          passwordHash: hashPassword(dto.password),
          name: dto.name,
        },
      }),
      this.prisma.board.update({
        where: { id: board.id },
        data: {
          postsCounter: {
            increment: 1,
          },
        },
      }),
    ];

    if (await this.banService.isBanned(anonUser)) {
      return new CommandResponse(CreatePostResult.BANNED);
    }

    const isBump =
      dto.email?.toLowerCase() !== 'sage' &&
      (parentPost ? !parentPost.isAntibumped : true);

    if (parentPost && isBump) {
      transactions.push(
        this.prisma.post.update({
          where: { guid: parentPost.guid },
          data: {
            bumpedAt: new Date(),
          },
        }),
      );
    }

    try {
      await this.prisma.$transaction(transactions);

      return new CommandResponse(CreatePostResult.OK, {
        boardId: dto.boardId,
        parentId: dto.parentId,
        id: postId,
      });
    } catch (err) {
      return new CommandResponse(CreatePostResult.UNKNOWN_ERROR);
    }
  }
}
