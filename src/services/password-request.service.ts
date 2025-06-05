import { randomBytes } from 'crypto';
import { PasswordRequestRepository } from 'src/repositories/password-request.repo';

export class PasswordRequestService {
  constructor(private readonly passwordRepository: PasswordRequestRepository) {}

  async findAll() {
    return await this.passwordRepository.findAll();
  }

  async findByUserId(userId: string) {
    return await this.passwordRepository.findByEmail(userId);
  }

  async create(userId: string, token: string) {
    return await this.passwordRepository.create(userId, token);
  }

  async generateToken(length: number): Promise<string> {
    return randomBytes(length).toString('hex');
  }
}
