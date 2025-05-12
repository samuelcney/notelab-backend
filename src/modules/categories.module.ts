import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CategoryController } from '../controllers/categories.controller';
import { CategoryRepository } from '../repositories/categories.repo';
import { CategoryService } from '../services/categories.service';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository, JwtService],
  exports: [CategoryService],
})
export class CategoryModule {}
