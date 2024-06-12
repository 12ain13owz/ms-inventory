import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import sequelize from '../utils/sequelize';

export class Track extends Model<
  InferAttributes<Track>,
  InferCreationAttributes<Track>
> {
  id: CreationOptional<number>;
}

export default Track.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  },
  {
    sequelize,
    modelName: 'Track',
    timestamps: false,
  }
);
