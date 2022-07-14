export type Backlink = {
  boardId: string;
  id: number;
};

export const findBacklinks = (
  boardId: string,
  content: string,
): Backlink[] => {
  const backlinks: Backlink[] = [];
  const matches = [
    ...content.matchAll(/>>(?<boardId>\/[a-z]+\/)?(?<postId>\d+)/g),
  ];

  for (const match of matches) {
    backlinks.push({
      boardId: match.groups?.boardId ?? boardId,
      id: parseInt(match.groups?.postId),
    });
  }

  return backlinks;
};
