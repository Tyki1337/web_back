import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const CredetialsSchema = z.object({
  email: z.string(),
  password: z.string().min(5).max(15),
});

export type CredetialsType = z.infer<typeof CredetialsSchema>;
export class CredetialsDto extends createZodDto(CredetialsSchema) {}
