import { Board, Prisma } from '@prisma/client';
import { prisma } from '../database';

const exampleBoard = {
  id: 'b',
  name: 'Random',
};

export const createBoards = async () => {
  return prisma.board.upsert({
    where: { id: exampleBoard.id },
    create: exampleBoard,
    update: exampleBoard,
  });
};
