import { Op } from 'sequelize';
import categoryModel, { Category } from '../models/category.model';

export const categoryService = {
  findAll(): Promise<Category[]> {
    return categoryModel.findAll({ ...queryOptions() });
  },

  findById(id: number): Promise<Category | null> {
    return categoryModel.findByPk(id, { ...queryOptions() });
  },

  findByName(name: string): Promise<Category | null> {
    return categoryModel.findOne({
      where: { name: { [Op.like]: name } },
      ...queryOptions(),
    });
  },

  create(category: Category): Promise<Category> {
    return categoryModel.create(category.toJSON());
  },

  update(
    id: number,
    category: Partial<Category>
  ): Promise<[affectedCount: number]> {
    return categoryModel.update(category, { where: { id } });
  },

  delete(id: number): Promise<number> {
    return categoryModel.destroy({ where: { id } });
  },
};

function queryOptions() {
  return { attributes: { exclude: ['createdAt', 'updatedAt'] } };
}
