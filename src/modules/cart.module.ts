import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { CartRepository } from 'src/repositories/cart.repo';
import { CoursesModule } from './course.module';
import { CartService } from 'src/services/cart.service';

@Module({
  imports: [PrismaModule, CoursesModule],
  controllers: [],
  providers: [CartRepository, CartService],
  exports: [],
})
export class CartModule {}
