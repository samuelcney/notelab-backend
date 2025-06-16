import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createLessonSchema = z.object({
  moduleId: z.string(),
  title: z.string(),
  videoUrl: z.string().url(),
  description: z.string().optional(),
});

export class CreateLessonDTO extends createZodDto(createLessonSchema) {}
