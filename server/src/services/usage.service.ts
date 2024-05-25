import { Op } from 'sequelize';
import UsageModel, { Usage } from '../models/usage.model';

export const usageService = {
  findAll(): Promise<Usage[]> {
    return UsageModel.findAll({ ...queryOptions() });
  },

  findById(id: number): Promise<Usage | null> {
    return UsageModel.findByPk(id, { ...queryOptions() });
  },

  findByName(name: string): Promise<Usage | null> {
    return UsageModel.findOne({
      where: { name: { [Op.like]: name } },
      ...queryOptions(),
    });
  },

  create(usage: Usage): Promise<Usage> {
    return UsageModel.create(usage.toJSON());
  },

  update(id: number, usage: Partial<Usage>): Promise<[affectedCount: number]> {
    return UsageModel.update(usage, { where: { id } });
  },

  delete(id: number): Promise<number> {
    return UsageModel.destroy({ where: { id } });
  },
};

function queryOptions() {
  return { attributes: { exclude: ['createdAt', 'updatedAt'] } };
}
