import { Op } from 'sequelize';
import { Category } from '../models/category.model';
import CategoryModel from '../models/category.model';

export function findCategoryByName(name: string): Promise<Category | null> {
  return CategoryModel.findOne({ where: { name: { [Op.like]: name } } });
}

export function findAllCategory() {
  return CategoryModel.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });
}

export function createCategory(category: Category): Promise<Category> {
  return CategoryModel.create(category.dataValues);
}

export function updateCategory(
  id: number,
  category: Partial<Category>
): Promise<[affectedCount: number]> {
  return CategoryModel.update(category, { where: { id } });
}

export function deleteCategory(id: number): Promise<number> {
  return CategoryModel.destroy({ where: { id } });
}
