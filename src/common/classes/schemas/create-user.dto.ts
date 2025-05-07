import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const CreateUserSchema = z.object({
  id: z.string().optional(),
  email: z.string().email({ message: 'E-mail inválido' }),
  name: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  password: z
    .string()
    .min(8, { message: 'Senha deve ter pelo menos 8 caracteres' }),
  role: z.enum(['ADMIN', 'STUDENT', 'INSTRUCTOR']).optional(),
});

export class CreateUserDTO extends createZodDto(CreateUserSchema) {}
