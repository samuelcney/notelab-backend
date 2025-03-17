import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { CartRepository } from 'src/repositories/cart.repo';
import { CoursesModule } from './course.module';
import { CartService } from 'src/services/cart.service';
import { CartController } from 'src/controllers/cart.controller';

@Module({
  imports: [PrismaModule, CoursesModule],
  controllers: [CartController],
  providers: [CartRepository, CartService],
})
export class CartModule {}
