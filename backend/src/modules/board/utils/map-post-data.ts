import { Post, PostBacklink } from '@prisma/client';
import { DEFAULT_NAME } from '../../../config';

type PostWithBacklinks = Post & {
  linkedBy: PostBacklink[];
  linksTo: PostBacklink[];
};

type Wordfilter = {
  input: string;
  output: string;
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

export const mapPostData = (
  post: PostWithBacklinks,
  wordfilters: Wordfilter[],
) => {
  return {
    id: post.id,
    createdAt: post.createdAt,
    name: post.name ?? DEFAULT_NAME,
    email: post.email,
    content: transformContent(post.content, wordfilters),
    linkedBy: mapLinkedBy(post.linkedBy),
    linksTo: mapLinksTo(post.linksTo),
  };
};

export const mapThreadData = (
  post: PostWithBacklinks & {
    replies: PostWithBacklinks[];
    _count: { replies: number };
  },
  wordfilters: Wordfilter[],
) => {
  return {
    id: post.id,
    createdAt: post.createdAt,
    name: post.name ?? DEFAULT_NAME,
    email: post.email,
    content: transformContent(post.content, wordfilters),
    isPinned: post.isPinned,
    repliesCount: post._count.replies,
    replies: post.replies
      .sort((a: Post, b: Post) => (a.id > b.id ? 1 : -1))
      .map((reply) => mapPostData(reply, wordfilters)),
    linkedBy: mapLinkedBy(post.linkedBy),
    linksTo: mapLinksTo(post.linksTo),
  };
};

const transformContent = (content, wordfilters) => {
  for (const wordfilter of wordfilters) {
    const searchRegExp = new RegExp(wordfilter.input, 'g');
    content = content.replace(searchRegExp, wordfilter.output);
  }

  return content;
};
