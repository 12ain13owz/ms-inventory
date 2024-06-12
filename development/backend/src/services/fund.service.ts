import { Op } from 'sequelize';
import FundModel, { Fund } from '../models/fund.model';

export const fundService = {
  findAll(): Promise<Fund[]> {
    return FundModel.findAll({ ...queryOptions() });
  },

  findById(id: number): Promise<Fund | null> {
    return FundModel.findByPk(id, { ...queryOptions() });
  },

  findByName(name: string): Promise<Fund | null> {
    return FundModel.findOne({
      where: { name: { [Op.like]: name } },
      ...queryOptions(),
    });
  },

  create(fund: Fund): Promise<Fund> {
    return FundModel.create(fund.toJSON());
  },

  update(id: number, fund: Partial<Fund>): Promise<[affectedCount: number]> {
    return FundModel.update(fund, { where: { id } });
  },

  delete(id: number): Promise<number> {
    return FundModel.destroy({ where: { id } });
  },
};

function queryOptions() {
  return { attributes: { exclude: ['createdAt', 'updatedAt'] } };
}
