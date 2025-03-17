import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class CartRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getCartByUserId(userId: number) {
    return await this.prisma.cart.findFirst({
      where: {
        userId,
      },
      include: {
        cartItems: true,
      },
    });
  }

  async getTotalCartValue(cartId: number) {
    return await this.prisma.cartItem.findMany({
      where: {
        cartId,
      },
      select: {
        totalValue: true,
      },
    });
  }

  async addItemToCart(cartId: number, courseId: number, totalValue: number) {
    return await this.prisma.cartItem.create({
      data: {
        cartId,
        courseId,
        totalValue,
      },
    });
  }

  async removeItemFromCart(cartItemId: number) {
    return await this.prisma.cartItem.delete({
      where: { id: cartItemId },
    });
  }

  async clearCart(cartId: number) {
    return await this.prisma.cartItem.deleteMany({
      where: { cartId },
    });
  }
}
