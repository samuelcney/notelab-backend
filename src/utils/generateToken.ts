import { randomBytes } from 'crypto';

export const generateRandomToken = (length: number): string => {
  return randomBytes(length).toString('hex');
};
