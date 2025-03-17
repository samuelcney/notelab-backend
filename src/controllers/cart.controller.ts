import { Controller, Get, Param } from '@nestjs/common';
import { CartService } from 'src/services/cart.service';

@Controller('/cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get('/:id')
  getCartByUserId(@Param('id') userId: number) {
    return this.cartService.getCartByUserId(userId);
  }
}
