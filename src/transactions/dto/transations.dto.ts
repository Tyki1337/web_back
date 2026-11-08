import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const transactionTypeSchema = z.enum(['income', 'expense']);

// Схема для создания транзакции (POST /api/transactions)
export const createTransactionSchema = z.object({
  title: z.string().min(3, 'Название не должно быть пустым'),
  amount: z.number().positive('Сумма должна быть больше нуля'),
  type: transactionTypeSchema,
  category: z.string().min(1, 'Категория обязательна'), // соответсвует draft.category
  date: z.iso.datetime({ message: 'Дата должна быть в формате ISO string' }), // или просто z.string() если формат даты проще
});

export type CreateTransactionType = z.infer<typeof createTransactionSchema>;

// Экспортируем TypeScript-тип для контроллеров NestJS
export class CreateTransactionDto extends createZodDto(
  createTransactionSchema,
) {}

// Схема для обновления (PATCH /api/transactions/:id) — все поля опциональны
export const updateTransactionSchema = createTransactionSchema.partial();

export type UpdateTransactionType = z.infer<typeof updateTransactionSchema>;

export class UpdateTransactionDto extends createZodDto(
  updateTransactionSchema,
) {}
