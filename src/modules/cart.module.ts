import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CartController } from '@/controllers/cart.controller';
import { CartRepository } from '@/repositories/cart.repo';
import { CartService } from '@/services/cart.service';
import { CoursesModule } from './course.module';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [PrismaModule, CoursesModule],
  controllers: [CartController],
  providers: [CartRepository, CartService, JwtService],
})
export class CartModule {}
