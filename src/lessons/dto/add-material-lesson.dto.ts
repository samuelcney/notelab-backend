import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const AddMaterialLessonSchema = z.object({
  title: z.string(),
  type: z.enum(['QUIZ', 'TEXT', 'PDF', 'VIDEO']),
  content: z.string().optional(),
});

export class AddMaterialToCourseDTO extends createZodDto(
  AddMaterialLessonSchema,
) {}
