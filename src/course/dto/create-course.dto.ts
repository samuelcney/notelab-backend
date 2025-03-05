import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const CreateCourseSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  description: z.string(),
  price: z.number().min(0, { message: 'Preço não pode ser negativo' }),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  instructorId: z.number(),
  categories: z.array(z.object({ categoryId: z.number() })).optional(),
});

export class CreateCourseDTO extends createZodDto(CreateCourseSchema) {}
