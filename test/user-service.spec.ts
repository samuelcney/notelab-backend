import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../src/users/users.service';
import { UsersRepository } from '../src/users/users.repo';
import {
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: UsersRepository;

  beforeEach(async () => {
    const usersRepositoryMock = {
      findAll: jest.fn().mockResolvedValue([
        {
          id: 1,
          name: 'User One',
          email: 'user1@example.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: 'User Two',
          email: 'user2@example.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]),
      findByEmail: jest.fn(email =>
        email === 'existing@example.com'
          ? Promise.resolve({
              id: 1,
              name: 'John Doe',
              email: 'existing@example.com',
              createdAt: new Date(),
              updatedAt: new Date(),
            })
          : Promise.resolve(null),
      ),
      findById: jest.fn(id =>
        id === 1
          ? Promise.resolve({
              id: 1,
              name: 'John Doe',
              email: 'existing@example.com',
              createdAt: new Date(),
              updatedAt: new Date(),
            })
          : Promise.resolve(null),
      ),
      create: jest.fn(async data => ({
        id: Date.now(),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      delete: jest.fn(async id => {
        if (id !== 1)
          throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
        return { success: true };
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepository, useValue: usersRepositoryMock },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
  });

  it('should retrieve all users', async () => {
    const users = await usersService.getAllUsers();
    expect(users).toHaveLength(2);
    expect(usersRepository.findAll).toHaveBeenCalled();
  });

  it('should retrieve a user by email', async () => {
    const user = await usersService.getUserByEmail('existing@example.com');
    expect(user).toBeDefined();
    expect(user.email).toBe('existing@example.com');
  });

  it('should throw NotFoundException if email is not found', async () => {
    await expect(
      usersService.getUserByEmail('notfound@example.com'),
    ).rejects.toThrow(NotFoundException);
  });

  it('should retrieve a user by ID', async () => {
    const user = await usersService.getUserById(1);
    expect(user).toBeDefined();
    expect(user.id).toBe(1);
  });

  it('should throw NotFoundException if user ID is not found', async () => {
    await expect(usersService.getUserById(999)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should create a user successfully', async () => {
    jest.spyOn(bcrypt, 'hashSync').mockReturnValue('hashedPassword');

    const newUser = await usersService.createUser({
      name: 'New User',
      email: 'newuser@example.com',
      password: '12345678',
    });

    expect(newUser).toHaveProperty('id');
    expect(newUser.name).toBe('New User');
    expect(newUser.email).toBe('newuser@example.com');
    expect(usersRepository.create).toHaveBeenCalled();
  });

  it('should throw ConflictException if email is already registered', async () => {
    await expect(
      usersService.createUser({
        name: 'John Doe',
        email: 'existing@example.com',
        password: '12345678',
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should throw InternalServerErrorException on unexpected error', async () => {
    jest
      .spyOn(usersRepository, 'create')
      .mockRejectedValue(new Error('Database error'));

    await expect(
      usersService.createUser({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password',
      }),
    ).rejects.toThrow(InternalServerErrorException);
  });

  it('should delete a user successfully', async () => {
    await expect(usersService.deleteUser(1)).resolves.toEqual({
      success: true,
    });
    expect(usersRepository.delete).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException when deleting a non-existing user', async () => {
    await expect(usersService.deleteUser(999)).rejects.toThrow(
      NotFoundException,
    );
  });
});
