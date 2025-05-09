import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const UpdateProfileInfoSchema = z.object({
  userId: z.string().optional(),
  name: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional(),
  phone: z.string().optional(),
});

export class UpdateUserDTO extends createZodDto(UpdateProfileInfoSchema) {}
