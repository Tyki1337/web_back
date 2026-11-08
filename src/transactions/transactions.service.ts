import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import {
  CreateTransactionType,
  UpdateTransactionDto,
} from './dto/transations.dto';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createTransactionDto: CreateTransactionType) {
    try {
      return await this.prisma.transaction.create({
        data: {
          ownerId: userId,
          categoryId: createTransactionDto.category,
          title: createTransactionDto.title,
          amount: createTransactionDto.amount,
          type: createTransactionDto.type,
          date: new Date(createTransactionDto.date),
        },
        include: { category: true },
      });
    } catch {
      throw new InternalServerErrorException(`Ошибка при создании транзакции`);
    }
  }

  async findAll(userId: string) {
    return this.prisma.transaction.findMany({
      where: { ownerId: userId },
      include: { category: true },
      orderBy: { date: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const transaction = await this.prisma.transaction.findFirst({
      where: { id, ownerId: userId },
      include: { category: true },
    });

    if (!transaction) {
      throw new NotFoundException(`Транзакция с ID ${id} не найдена`);
    }

    return transaction;
  }

  async update(
    userId: string,
    id: string,
    updateTransactionDto: UpdateTransactionDto,
  ) {
    await this.findOne(userId, id);

    try {
      return await this.prisma.transaction.update({
        where: { id },
        data: {
          ...(updateTransactionDto.category && {
            categoryId: updateTransactionDto.category,
          }),
          ...(updateTransactionDto.title && {
            title: updateTransactionDto.title,
          }),
          ...(updateTransactionDto.amount !== undefined && {
            amount: updateTransactionDto.amount,
          }),
          ...(updateTransactionDto.type && { type: updateTransactionDto.type }),
          ...(updateTransactionDto.date && {
            date: new Date(updateTransactionDto.date),
          }),
        },
        include: { category: true },
      });
    } catch {
      throw new InternalServerErrorException(
        `Ошибка при обновлении транзакции`,
      );
    }
  }

  async remove(userId: string, id: string) {
    // Проверяем владельца перед удалением
    await this.findOne(userId, id);

    try {
      await this.prisma.transaction.delete({
        where: { id },
      });
      return { message: 'Транзакция успешно удалена' };
    } catch {
      throw new InternalServerErrorException(`Ошибка при удалении транзакции`);
    }
  }
  async getCategories() {
    try {
      const categories = await this.prisma.category.findMany({
        select: {
          id: true,
          name: true,
        },
        orderBy: {
          name: 'asc',
        },
      });

      return categories;
    } catch (error) {
      console.error('PRISMA ERROR:', error);
      throw new InternalServerErrorException('Не удалось загрузить категории');
    }
  }
}
