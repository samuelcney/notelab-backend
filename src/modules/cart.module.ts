import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CartController } from 'src/controllers/cart.controller';
import { CartRepository } from 'src/repositories/cart.repo';
import { CartService } from 'src/services/cart.service';
import { CoursesModule } from './course.module';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [PrismaModule, CoursesModule],
  controllers: [CartController],
  providers: [CartRepository, CartService, JwtService],
})
export class CartModule {}
