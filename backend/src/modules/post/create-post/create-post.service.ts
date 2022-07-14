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
import { BoardCache } from '../../../modules/board/board.cache';

@Injectable()
export class CreatePostService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly banService: BanService,
    private readonly boardCache: BoardCache
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

    if (await this.banService.isBanned(anonUser)) {
      return new CommandResponse(CreatePostResult.BANNED);
    }

    const backlinks = findBacklinks(dto.boardId, dto.content);
    const backlinkedPosts: (Post & { parent?: { id?: number } })[] = [];

    for (const backlink of backlinks) {
      const backlinkedPost = await this.prisma.post.findUnique({
        where: {
          boardId_id: backlink,
        },
        include: {
          parent: {
            select: { id: true },
          },
        },
      });

      if (backlinkedPost) {
        backlinkedPosts.push(backlinkedPost);
      }
    }

    let postId: number;

    try {
      await this.prisma.$transaction(async (prisma) => {
        const updatedBoard = await prisma.board.update({
          where: { id: board.id },
          data: {
            postsCounter: {
              increment: 1,
            },
          },
        });

        postId = updatedBoard.postsCounter;

        const post = await prisma.post.create({
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
            linksTo: {
              create: backlinkedPosts.map((bp) => {
                return {
                  post: {
                    connect: {
                      guid: bp.guid,
                    },
                  },
                  postId: bp.id,
                  postBoardId: bp.boardId,
                  postParentId: bp.parent?.id,
                  linkedById: postId,
                  linkedByBoardId: board.id,
                  linkedByParentId: parentPost?.id,
                };
              }),
            },
          },
        });

        const isBump =
          dto.email?.toLowerCase() !== 'sage' &&
          (parentPost ? !parentPost.isAntibumped : true);

        if (parentPost && isBump) {
          await prisma.post.update({
            where: { guid: parentPost.guid },
            data: {
              bumpedAt: new Date(),
            },
          });
        }
      });

      await this.boardCache.clearBoardCache(board.id);

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
