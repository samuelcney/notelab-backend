import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class CartRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getCartByUserId(userId: number) {
    return this.prisma.cart.findFirst({
      where: {
        userId,
      },
      include: {
        cartItems: true,
      },
    });
  }

  async addItemToCart(cartId: number, courseId: number, totalValue: number) {
    return this.prisma.cartItem.create({
      data: {
        cartId,
        courseId,
        totalValue,
      },
    });
  }

  async removeItemFromCart(cartItemId: number) {
    return this.prisma.cartItem.delete({
      where: { id: cartItemId },
    });
  }

  async clearCart(cartId: number) {
    return this.prisma.cartItem.deleteMany({
      where: { cartId },
    });
  }
}
