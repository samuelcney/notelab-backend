import { randomBytes } from 'crypto';

export const generateRandomToken = async (length: number): Promise<string> => {
  return randomBytes(length).toString('hex');
};
