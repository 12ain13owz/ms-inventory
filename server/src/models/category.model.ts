import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import sequelize from '../utils/sequelize';

export class Category extends Model<
  InferAttributes<Category>,
  InferCreationAttributes<Category>
> {
  id?: number;
  name: string;
  remark: string | null;
  active: boolean;
}

export default Category.init(
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
  },
  {
    indexes: [{ unique: true, fields: ['name'] }],
    sequelize,
    modelName: 'Cagetory',
    timestamps: true,
  }
);
