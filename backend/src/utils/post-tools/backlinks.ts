export type PostBacklink = {
  boardId: string;
  postId: number;
};

export const findBacklinks = (
  boardId: string,
  content: string,
): PostBacklink[] => {
  const backlinks: PostBacklink[] = [];
  const matches = [
    ...content.matchAll(/>>(?<boardId>\/[a-z]+\/)?(?<postId>\d+)/g),
  ];

  for (const match of matches) {
    backlinks.push({
      boardId: match.groups?.boardId ?? boardId,
      postId: parseInt(match.groups?.postId),
    });
  }

  return backlinks;
};
