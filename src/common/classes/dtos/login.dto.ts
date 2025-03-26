import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export class LoginDTO extends createZodDto(LoginSchema) {}
