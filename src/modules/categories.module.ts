import { Module } from '@nestjs/common';
import { CategoryRepository } from '../repositories/categories.repo';
import { CategoryService } from '../services/categories.service';
import { CategoryController } from '../controllers/categories.controller';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository],
  exports: [CategoryService],
})
export class CategoryModule {}
