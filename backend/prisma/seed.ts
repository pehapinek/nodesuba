import { prisma } from './database';
import { createBoards } from './seed/board';
import { createThreadsWithReplies } from './seed/post';

const loadSeed = async () => {
  await createBoards();
  await createThreadsWithReplies();
};

loadSeed()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
