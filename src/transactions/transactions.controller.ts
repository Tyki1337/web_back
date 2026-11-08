import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import type {
  CreateTransactionType,
  UpdateTransactionDto,
} from './dto/transations.dto';
import { SupabaseAuthGuard } from 'src/common/guards/auth.guard';
import { UserId } from 'src/common/decorators/auth.decorator';

@Controller('transactions')
@UseGuards(SupabaseAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(
    @UserId() id: string,
    @Body() createTransactionDto: CreateTransactionType,
  ) {
    return this.transactionsService.create(id, createTransactionDto);
  }
  @Get('categories')
  getCategories() {
    return this.transactionsService.getCategories();
  }

  @Get()
  findAll(@UserId() userId: string) {
    return this.transactionsService.findAll(userId);
  }

  @Get(':id')
  findOne(@UserId() userId: string, @Param('id') id: string) {
    return this.transactionsService.findOne(userId, id);
  }

  @Patch(':id')
  update(
    @UserId() userId: string,
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(userId, id, updateTransactionDto);
  }

  @Delete(':id')
  remove(@UserId() userId: string, @Param('id') id: string) {
    return this.transactionsService.remove(userId, id);
  }
}
