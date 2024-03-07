import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import sequelize from '../utils/sequelize';

export class Status extends Model<
  InferAttributes<Status>,
  InferCreationAttributes<Status>
> {
  id?: number;
  name: string;
  place: string | null;
  remark: string | null;
  active: boolean;
}

export default Status.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    place: {
      type: DataTypes.TEXT,
      defaultValue: '',
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    remark: {
      type: DataTypes.TEXT,
      defaultValue: '',
    },
  },
  {
    indexes: [{ unique: true, fields: ['name'] }],
    sequelize,
    modelName: 'Status',
    timestamps: true,
  }
);
