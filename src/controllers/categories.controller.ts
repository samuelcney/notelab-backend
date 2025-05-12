import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CategoryDTO } from 'src/common/classes/dtos/create-category.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CategoryService } from '../services/categories.service';

@UseGuards(AuthGuard)
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  getAllCategories() {
    return this.categoryService.getAllCategories();
  }

  @Get('/:id')
  getCategoryById(@Param('id') id: number) {
    return this.categoryService.getCategoryById(Number(id));
  }

  @Post()
  addCategory(@Body() data: CategoryDTO) {
    return this.categoryService.addCategory(data);
  }

  @Put('/:id')
  updateCategory(@Body() data: CategoryDTO, @Param('id') id: number) {
    return this.categoryService.updateCategory(data, Number(id));
  }
  @Delete('/:id')
  deleteCategory(@Param('id') id: number) {
    return this.categoryService.deleteCategory(Number(id));
  }
}
