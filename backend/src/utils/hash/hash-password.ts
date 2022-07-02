import { createHash } from 'crypto';

export const hashPassword = (password?: string) => {
  return createHash('md5').update(password).digest('hex');
};
