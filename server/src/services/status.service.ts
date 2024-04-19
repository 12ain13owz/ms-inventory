import { Op } from 'sequelize';
import statusModel, { Status } from '../models/status.model';

export function findAllStatus() {
  return statusModel.findAll({
    ...getStatusQueryOptions(),
  });
}

export function findStatusById(id: number): Promise<Status | null> {
  return statusModel.findByPk(id, {
    ...getStatusQueryOptions(),
  });
}

export function findStatusByName(name: string): Promise<Status | null> {
  return statusModel.findOne({
    where: { name: { [Op.like]: name } },
    ...getStatusQueryOptions(),
  });
}

export function createStatus(status: Status): Promise<Status> {
  return statusModel.create(status.toJSON());
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

function getStatusQueryOptions() {
  return {
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  };
}
