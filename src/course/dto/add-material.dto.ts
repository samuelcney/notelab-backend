import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const AddMaterialToCourseSchema = z.object({
  courseMaterials: z.array(
    z.object({
      title: z.string(),
      type: z.enum(['QUIZ', 'TEXT', 'PDF', 'VIDEO']),
      content: z.string().optional(),
    }),
  ),
});

export class AddMaterialToCourseDTO extends createZodDto(
  AddMaterialToCourseSchema,
) {}
