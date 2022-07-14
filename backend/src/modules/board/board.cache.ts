import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class BoardCache {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async clearBoardCache(boardId: string) {
    // TODO: implement wildcard deletion
    await this.cacheManager.reset();
  }

  async cacheBoardPagination(boardId: string, page: number, data: unknown) {
    await this.cacheManager.set(`board_${boardId}_page_${page}`, data);
  }

  async getBoardPagination(boardId: string, page: number) {
    return await this.cacheManager.get(`board_${boardId}_page_${page}`);
  }

  async cacheThread(boardId: string, id: number, data: unknown) {
    await this.cacheManager.set(`board_${boardId}_thread_${id}`, data);
  }

  async invalidateThread(boardId: string, id: number) {
    // TODO: implement wildcard deletion
    await this.cacheManager.reset();
  }

  async getThread(boardId: string, id: number) {
    return await this.cacheManager.get(`board_${boardId}_thread_${id}`);
  }
}
