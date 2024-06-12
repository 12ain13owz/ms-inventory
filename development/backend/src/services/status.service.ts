import { Op } from 'sequelize';
import StatusModel, { Status } from '../models/status.model';

export const statusService = {
  findAll(): Promise<Status[]> {
    return StatusModel.findAll({ ...queryOptions() });
  },

  findById(id: number): Promise<Status | null> {
    return StatusModel.findByPk(id, { ...queryOptions() });
  },

  findByName(name: string): Promise<Status | null> {
    return StatusModel.findOne({
      where: { name: { [Op.like]: name } },
      ...queryOptions(),
    });
  },

  create(status: Status): Promise<Status> {
    return StatusModel.create(status.toJSON());
  },

  update(
    id: number,
    status: Partial<Status>
  ): Promise<[affectedCount: number]> {
    return StatusModel.update(status, { where: { id } });
  },

  delete(id: number): Promise<number> {
    return StatusModel.destroy({ where: { id } });
  },
};

function queryOptions() {
  return { attributes: { exclude: ['createdAt', 'updatedAt'] } };
}
