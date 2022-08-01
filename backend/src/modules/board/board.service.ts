import { Injectable } from '@nestjs/common';
import { POSTS_PER_PAGE } from '../../config';
import { BoardCache } from './board.cache';
import { PrismaService } from '../prisma';
import { mapThreadData } from './utils/map-post-data';
import { WordfilterService } from '../wordfilter/wordfilter.service';

@Injectable()
export class BoardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly boardCache: BoardCache,
    private readonly wordfilterService: WordfilterService,
  ) {}

  async listBoards() {
    return this.prisma.board.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }

  async paginatePosts(boardId: string, page: number) {
    const cachedPosts = await this.boardCache.getBoardPagination(boardId, page);

    if (cachedPosts) {
      return cachedPosts;
    }

    const posts = await this.prisma.post.findMany({
      where: {
        boardId: boardId,
        parent: null,
      },
      orderBy: [{ isPinned: 'desc' }, { bumpedAt: 'desc' }],
      include: {
        replies: {
          include: {
            linkedBy: true,
            linksTo: true,
          },
          take: 3,
          orderBy: { createdAt: 'desc' },
        },
        linkedBy: true,
        linksTo: true,
        _count: {
          select: { replies: true },
        },
      },
      take: POSTS_PER_PAGE,
      skip: POSTS_PER_PAGE * page,
    });
    const wordfilters = await this.wordfilterService.getWordfilters();

    const pagePosts = posts.map((post) => mapThreadData(post, wordfilters));

    await this.boardCache.cacheBoardPagination(boardId, page, pagePosts);

    return pagePosts;
  }

  async getThread(boardId: string, postId: number) {
    const cachedThread = await this.boardCache.getThread(boardId, postId);

    if (cachedThread) {
      return cachedThread;
    }

    const thread = await this.prisma.post.findUnique({
      where: {
        boardId_id: {
          boardId: boardId,
          id: postId,
        },
      },
      include: {
        replies: {
          include: {
            linkedBy: true,
            linksTo: true,
          },
          orderBy: { createdAt: 'asc' },
        },
        linkedBy: true,
        linksTo: true,
        _count: {
          select: { replies: true },
        },
      },
    });

    if (!thread) {
      return null;
    }

    const wordfilters = await this.wordfilterService.getWordfilters();

    const threadMapped = mapThreadData(thread, wordfilters);

    await this.boardCache.cacheThread(boardId, postId, threadMapped);

    return threadMapped;
  }
}
