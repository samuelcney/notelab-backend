import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class CartRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getCartByUserId(userId: string) {
    return await this.prisma.cart.findFirst({
      where: {
        userId,
      },
      select: {
        id: true,
        cartItems: {
          select: {
            id: true,
            course: true,
          },
        },
      },
    });
  }

  async addItemToCart(cartId: string, courseId: string) {
    return await this.prisma.cartItem.create({
      data: {
        cartId,
        courseId,
      },
    });
  }

  async removeItemFromCart(cartId: string, courseId: string) {
    const item = await this.prisma.cartItem.findFirst({
      where: {
        cartId,
        courseId,
      },
    });

    if (!item) {
      throw new NotFoundException(
        'Item não encontrado ou não pertence a este carrinho.',
      );
    }

    return await this.prisma.cartItem.delete({ where: { id: item.id } });
  }

  async clearCart(cartId: string) {
    return await this.prisma.cartItem.deleteMany({
      where: { cartId },
    });
  }
}
