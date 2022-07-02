import { Injectable } from '@nestjs/common';
import { POSTS_PER_PAGE } from '../../config';
import { PrismaService } from '../prisma';
import { mapThreadData } from './utils/map-post-data';

@Injectable()
export class BoardService {
  constructor(private readonly prisma: PrismaService) {}

  async listBoards() {
    return this.prisma.board.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }

  async paginatePosts(boardId: string, page: number) {
    const posts = await this.prisma.post.findMany({
      where: {
        boardId: boardId,
        parent: null,
      },
      orderBy: [{ isPinned: 'desc' }, { bumpedAt: 'desc' }],
      include: {
        replies: {
          take: 3,
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { replies: true },
        },
      },
      take: POSTS_PER_PAGE,
      skip: POSTS_PER_PAGE * page,
    });

    return posts.map((post) => mapThreadData(post));
  }

  async getThread(boardId: string, postId: number) {
    const thread = await this.prisma.post.findUnique({
      where: {
        boardId_id: {
          boardId: boardId,
          id: postId,
        },
      },
      include: {
        replies: {
          orderBy: { createdAt: 'asc' },
        },
        _count: {
          select: { replies: true },
        },
      },
    });

    if (!thread) {
      return null;
    }

    return mapThreadData(thread);
  }
}
