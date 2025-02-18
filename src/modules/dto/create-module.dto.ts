import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createModuleSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'O nome deve ter no mínimo 3 caracteres' }),
  courseId: z.number(),
});

export class CreateModuleDTO extends createZodDto(createModuleSchema) {}
