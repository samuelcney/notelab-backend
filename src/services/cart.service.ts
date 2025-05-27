import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

    return cart;
  }

  async addProductToCart(cartId: string, courseId: string, userId: string) {
    const course = await this.courseService.getCourseById(courseId);

    if (!course) {
      throw new NotFoundException(
        `Curso com o ID ${courseId} não foi encontrado`,
      );
    }

    const courseExistsInCart =
      await this.cartRepository.getCartByUserId(userId);

    const alreadyInCart = courseExistsInCart?.cartItems.some(
      item => item.course.id === courseId,
    );

    if (alreadyInCart) {
      throw new BadRequestException(`Este curso já está no carrinho`);
    }

    return await this.cartRepository.addItemToCart(cartId, courseId);
  }

  async removeProductFromCart(cartId: string, courseId: string) {
    return await this.cartRepository.removeItemFromCart(cartId, courseId);
  }

  async clearCart(cartId: string) {
    return await this.cartRepository.clearCart(cartId);
  }
}
