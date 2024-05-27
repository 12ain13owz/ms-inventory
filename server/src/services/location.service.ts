import { Op } from 'sequelize';
import LocationModel, { Location } from '../models/location.model';

export const locationService = {
  findAll(): Promise<Location[]> {
    return LocationModel.findAll({ ...queryOptions() });
  },

  findById(id: number): Promise<Location | null> {
    return LocationModel.findByPk(id, { ...queryOptions() });
  },

  findByName(name: string): Promise<Location | null> {
    return LocationModel.findOne({
      where: { name: { [Op.like]: name } },
      ...queryOptions(),
    });
  },

  create(location: Location): Promise<Location> {
    return LocationModel.create(location.toJSON());
  },

  update(
    id: number,
    location: Partial<Location>
  ): Promise<[affectedCount: number]> {
    return LocationModel.update(location, { where: { id } });
  },

  delete(id: number): Promise<number> {
    return LocationModel.destroy({ where: { id } });
  },
};

function queryOptions() {
  return { attributes: { exclude: ['createdAt', 'updatedAt'] } };
}
