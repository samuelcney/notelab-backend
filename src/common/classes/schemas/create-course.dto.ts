import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const CreateCourseSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  description: z.string(),
  price: z.number().min(0, { message: 'Preço não pode ser negativo' }),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  instructorId: z.string(),
  coverImage: z.string().url().nullable(),
  issueCertificate: z.boolean(),
  categories: z.array(z.number()).optional(),
  modules: z
    .array(
      z.object({
        title: z.string().min(1),
        lessons: z
          .array(
            z.object({
              title: z.string().min(1),
              videoUrl: z.string().url(),
              duration: z.number().min(1),
            }),
          )
          .min(1),
      }),
    )
    .min(1),
});

export class CreateCourseDTO extends createZodDto(CreateCourseSchema) {}
