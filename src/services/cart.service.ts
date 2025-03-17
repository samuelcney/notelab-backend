import { Injectable, NotFoundException } from '@nestjs/common';
import { CartRepository } from 'src/repositories/cart.repo';
import { CoursesRepository } from 'src/repositories/course.repo';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly courseRepository: CoursesRepository,
  ) {}

  async getCartByUserId(id: number) {
    return await this.cartRepository.getCartByUserId(id);
  }

  async getCartTotalByUserId(id: number) {
    return await this.cartRepository.getTotalCartValue(id);
  }

  async addProductToCart(cartId: number, courseId: number, totalValue: number) {
    const course = await this.courseRepository.findById(courseId);

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
    return await this.cartRepository.removeItemFromCart(courseId);
  }

  async clearCart(cartId: number) {
    return await this.cartRepository.clearCart(cartId);
  }
}
