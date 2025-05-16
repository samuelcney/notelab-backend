import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createLessonSchema = z.object({
  moduleId: z.number(),
  title: z.string(),
  videoUrl: z.string().url(),
  duration: z.number().min(1, { message: 'Duração deve ser maior que 0' }),
  description: z.string().optional(),
});

export class CreateLessonDTO extends createZodDto(createLessonSchema) {}
