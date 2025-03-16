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
    return this.cartRepository.getCartByUserId(id);
  }

  async addProductToCart(cartId: number, courseId: number, totalValue: number) {
    const course = await this.courseRepository.findById(courseId);

    if (!course) {
      throw new NotFoundException(
        `Curso com o ID ${courseId} não foi encontrado`,
      );
    }

    return this.cartRepository.addItemToCart(cartId, courseId, totalValue);
  }

  async removeProductFromCart(courseId: number) {
    return this.cartRepository.removeItemFromCart(courseId);
  }

  async clearCart(cartId: number) {
    return this.cartRepository.clearCart(cartId);
  }
}
