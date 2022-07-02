import { Post } from '@prisma/client';
import { DEFAULT_NAME } from '../../../config';

export const mapPostData = (post: Post) => {
  return {
    id: post.id,
    createdAt: post.createdAt,
    name: post.name ?? DEFAULT_NAME,
    email: post.email,
    content: post.content,
  };
};

export const mapThreadData = (
  post: Post & {
    replies: Post[];
    _count: { replies: number };
  },
) => {
  return {
    id: post.id,
    createdAt: post.createdAt,
    name: post.name ?? DEFAULT_NAME,
    email: post.email,
    content: post.content,
    isPinned: post.isPinned,
    repliesCount: post._count.replies,
    replies: post.replies
      .sort((a: Post, b: Post) => (a.id > b.id ? 1 : -1))
      .map((reply) => mapPostData(reply)),
  };
};
