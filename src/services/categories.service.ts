import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CategoryRepository } from '../repositories/categories.repo';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async getAllCategories() {
    return await this.categoryRepository.findAll();
  }

  async getCategoryById(id: number) {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new NotFoundException(
        `Categoria com o ID ${id} não foi encontrada`,
      );
    }

    return category;
  }

  async addCategory(data: CategoryDTO) {
    const categoryToLowerCase = data.name.toLowerCase();

    const categoryExist =
      await this.categoryRepository.findByDescription(categoryToLowerCase);

    if (categoryExist) {
      throw new ConflictException(
        `A Categoria "${data.name}" já está cadastrada`,
      );
    }

    return await this.categoryRepository.create({
      ...data,
      name: categoryToLowerCase,
    });
  }

  async updateCategory(data: CategoryDTO, id: number) {
    const categoryExist = await this.categoryRepository.findById(id);

    if (!categoryExist) {
      throw new ConflictException(
        `Categoria com o ID ${id} não foi encontrada`,
      );
    }

    return await this.categoryRepository.update(categoryExist.id, data);
  }

  async deleteCategory(id: number) {
    const category = await this.categoryRepository.delete(id);

    if (!category) {
      throw new NotFoundException(
        `Categoria com o ID ${id} não foi encontrada`,
      );
    }

    return category;
  }
}
