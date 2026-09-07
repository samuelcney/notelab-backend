import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@/common/guards/auth.guard';
import { CartService } from '@/services/cart.service';

@UseGuards(AuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get('/:id')
  getCartByUserId(@Param('id') id: string) {
    return this.cartService.getCartByUserId(id);
  }

  @Post('/:cartId/add/:courseId')
  addProductToCart(
    @Param('cartId') cartId: string,
    @Param('courseId') courseId: string,
    @Req() req: Request,
  ) {
    const userId = req.user.id;
    return this.cartService.addProductToCart(cartId, courseId, userId);
  }

  @Delete('/:cartId/remove/:courseId')
  removeProductFromCart(
    @Param('cartId') cartId: string,
    @Param('courseId') courseId: string,
  ) {
    return this.cartService.removeProductFromCart(cartId, courseId);
  }

  @Delete('/:cartId/clear')
  clearCart(@Param('cartId') cartId: string) {
    return this.cartService.clearCart(cartId);
  }
}
