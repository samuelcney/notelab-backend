import { Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CartService } from 'src/services/cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get('/:id')
  getCartByUserId(@Param('id') id: number) {
    return this.cartService.getCartByUserId(Number(id));
  }

  @Get('/:id/total')
  getCartTotalByUserId(@Param('id') id: number) {
    return this.cartService.getCartTotalByUserId(Number(id));
  }

  @Post('/:cartId/add/:courseId/:totalValue')
  addProductToCart(
    @Param('cartId') cartId: number,
    @Param('courseId') courseId: number,
    @Param('totalValue') totalValue: number,
  ) {
    return this.cartService.addProductToCart(cartId, courseId, totalValue);
  }

  @Delete('/:courseId/remove')
  removeProductFromCart(@Param('courseId') courseId: number) {
    return this.cartService.removeProductFromCart(courseId);
  }

  @Delete('/:cartId/clear')
  clearCart(@Param('cartId') cartId: number) {
    return this.cartService.clearCart(cartId);
  }
}
