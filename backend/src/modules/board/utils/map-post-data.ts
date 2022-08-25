import { Post, PostBacklink } from '@prisma/client';
import { DEFAULT_NAME } from '../../../config';

type PostWithBacklinks = Post & {
  linkedBy: PostBacklink[];
  linksTo: PostBacklink[];
};

const mapLinksTo = (backlinks: PostBacklink[]) => {
  return backlinks.map((backlink) => {
    return {
      id: backlink.postId,
      boardId: backlink.postBoardId,
      parentId: backlink.postParentId,
    };
  });
};

const mapLinkedBy = (backlinks: PostBacklink[]) => {
  return backlinks.map((backlink) => {
    return {
      id: backlink.linkedById,
      boardId: backlink.linkedByBoardId,
      parentId: backlink.linkedByParentId,
    };
  });
};

export const mapPostData = (post: PostWithBacklinks) => {
  return {
    id: post.id,
    createdAt: post.createdAt,
    name: post.name ?? DEFAULT_NAME,
    email: post.email,
    content: post.content,
    linkedBy: mapLinkedBy(post.linkedBy),
    linksTo: mapLinksTo(post.linksTo),
  };
};

export const mapThreadData = (
  post: PostWithBacklinks & {
    replies: PostWithBacklinks[];
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
    isLocked: post.isLocked,
    repliesCount: post._count.replies,
    replies: post.replies
      .sort((a: Post, b: Post) => (a.id > b.id ? 1 : -1))
      .map((reply) => mapPostData(reply)),
    linkedBy: mapLinkedBy(post.linkedBy),
    linksTo: mapLinksTo(post.linksTo),
  };
};
