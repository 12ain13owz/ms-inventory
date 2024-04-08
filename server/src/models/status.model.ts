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
  remark: string;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
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
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    remark: {
      type: DataTypes.TEXT,
      defaultValue: '',
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    indexes: [{ fields: ['name'] }],
    sequelize,
    modelName: 'Status',
    timestamps: true,
  }
);
