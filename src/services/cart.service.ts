import { Injectable, NotFoundException } from '@nestjs/common';
import { CartRepository } from 'src/repositories/cart.repo';
import { CoursesService } from './course.service';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly courseService: CoursesService,
  ) {}

  async getCartByUserId(userId: string) {
    const cart = await this.cartRepository.getCartByUserId(userId);

    if (!cart) {
      throw new NotFoundException(
        `O carrinho com o ID ${userId} nao foi encontrado`,
      );
    }
  }

  async getCartTotalByUserId(id: number) {
    const cart = await this.cartRepository.getTotalCartValue(id);

    if (!cart) {
      throw new NotFoundException(
        `O carrinho com o ID ${id} nao foi encontrado`,
      );
    }
  }

  async addProductToCart(cartId: number, courseId: number, totalValue: number) {
    const course = await this.courseService.getCourseById(courseId);

    if (!course) {
      throw new NotFoundException(
        `Curso com o ID ${courseId} não foi encontrado`,
      );
    }

    return await this.cartRepository.addItemToCart(
      cartId,
      courseId,
      totalValue,
    );
  }

  async removeProductFromCart(courseId: number) {
    const courseToRemove =
      await this.cartRepository.removeItemFromCart(courseId);

    if (!courseToRemove) {
      throw new NotFoundException(
        `O curso com o ID ${courseId} não foi encontrado`,
      );
    }
  }

  async clearCart(cartId: number) {
    return await this.cartRepository.clearCart(cartId);
  }
}
