import { Op } from 'sequelize';
import usageStatusModel, { UsageStatus } from '../models/usage-status.model';

export const usageStatusService = {
  findAll(): Promise<UsageStatus[]> {
    return usageStatusModel.findAll({ ...queryOptions() });
  },

  findById(id: number): Promise<UsageStatus | null> {
    return usageStatusModel.findByPk(id, { ...queryOptions() });
  },

  findByName(name: string): Promise<UsageStatus | null> {
    return usageStatusModel.findOne({
      where: { name: { [Op.like]: name } },
      ...queryOptions(),
    });
  },

  create(usageStatus: UsageStatus): Promise<UsageStatus> {
    return usageStatusModel.create(usageStatus.toJSON());
  },

  update(
    id: number,
    usageStatus: Partial<UsageStatus>
  ): Promise<[affectedCount: number]> {
    return usageStatusModel.update(usageStatus, { where: { id } });
  },

  delete(id: number): Promise<number> {
    return usageStatusModel.destroy({ where: { id } });
  },
};

function queryOptions() {
  return { attributes: { exclude: ['createdAt', 'updatedAt'] } };
}
