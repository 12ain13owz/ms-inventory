import { Op } from 'sequelize';
import CategoryModel, { Category } from '../models/category.model';

export const categoryService = {
  findAll(): Promise<Category[]> {
    return CategoryModel.findAll({ ...queryOptions() });
  },

  findById(id: number): Promise<Category | null> {
    return CategoryModel.findByPk(id, { ...queryOptions() });
  },

  findByName(name: string): Promise<Category | null> {
    return CategoryModel.findOne({
      where: { name: { [Op.like]: name } },
      ...queryOptions(),
    });
  },

  create(category: Category): Promise<Category> {
    return CategoryModel.create(category.toJSON());
  },

  update(
    id: number,
    category: Partial<Category>
  ): Promise<[affectedCount: number]> {
    return CategoryModel.update(category, { where: { id } });
  },

  delete(id: number): Promise<number> {
    return CategoryModel.destroy({ where: { id } });
  },
};

function queryOptions() {
  return { attributes: { exclude: ['createdAt', 'updatedAt'] } };
}
