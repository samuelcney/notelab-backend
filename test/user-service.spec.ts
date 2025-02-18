import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../src/users/users.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { UsersRepository } from 'src/users/users.repo';
import { ConflictException } from '@nestjs/common';

describe('UsersService', () => {
  let usersService: UsersService;
  let prismaServiceMock;

  beforeEach(async () => {
    prismaServiceMock = {
      user: {
        create: jest.fn().mockImplementation(data => ({
          id: Date.now(),
          ...data,
        })),
        findUnique: jest.fn().mockImplementation(({ where }) => {
          return where.email === 'test@example.com'
            ? { id: 1, name: 'John Doe', email: 'test@example.com' }
            : null;
        }),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        UsersRepository,
        { provide: PrismaService, useValue: prismaServiceMock },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  it('should create and retrieve a user', async () => {
    const email = `user${Date.now()}@example.com`;
    const user = await usersService.createUser({
      name: 'John Doe',
      email: email,
      password: '12345678',
    });

    expect(user).toHaveProperty('id');
    expect(user.name).toBe('John Doe');
    expect(user.email).toBe(email);

    const foundUser = await usersService.getUserByEmail(email);
    expect(foundUser).not.toBeNull();
  });

  it('should throw ConflictException if email is already registered', async () => {
    await expect(
      usersService.createUser({
        name: 'John Doe',
        email: 'test@example.com',
        password: '12345678',
      }),
    ).rejects.toThrow(ConflictException);
  });
});
