import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import sequelize from '../utils/sequelize';

export class Fund extends Model<
  InferAttributes<Fund>,
  InferCreationAttributes<Fund>
> {
  id: CreationOptional<number>;
  name: string;
  remark: string;
  active: boolean;
  createdAt: CreationOptional<Date>;
  updatedAt: CreationOptional<Date>;
}

export default Fund.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    active: { type: DataTypes.BOOLEAN, allowNull: false },
    remark: { type: DataTypes.TEXT },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false },
  },
  {
    indexes: [{ fields: ['name'] }],
    sequelize,
    modelName: 'Fund',
    timestamps: true,
  }
);
