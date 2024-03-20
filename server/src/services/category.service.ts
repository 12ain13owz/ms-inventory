import { Op } from 'sequelize';
import categoryModel, { Category } from '../models/category.model';

export function findAllCategory() {
  return categoryModel.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });
}

export function findCategoryByName(name: string): Promise<Category | null> {
  return categoryModel.findOne({ where: { name: { [Op.like]: name } } });
}

export function createCategory(category: Category): Promise<Category> {
  return categoryModel.create(category.dataValues);
}

export function updateCategory(
  id: number,
  category: Partial<Category>
): Promise<[affectedCount: number]> {
  return categoryModel.update(category, { where: { id } });
}

export function deleteCategory(id: number): Promise<number> {
  return categoryModel.destroy({ where: { id } });
}
