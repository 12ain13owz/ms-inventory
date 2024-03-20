import { Op } from 'sequelize';
import statusModel, { Status } from '../models/status.model';

export function findAllStatus() {
  return statusModel.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });
}

export function findStatusByName(name: string): Promise<Status | null> {
  return statusModel.findOne({ where: { name: { [Op.like]: name } } });
}

export function createStatus(status: Status): Promise<Status> {
  return statusModel.create(status.dataValues);
}

export function updateStatus(
  id: number,
  status: Partial<Status>
): Promise<[affectedCount: number]> {
  return statusModel.update(status, { where: { id } });
}

export function deleteStatus(id: number): Promise<number> {
  return statusModel.destroy({ where: { id } });
}
