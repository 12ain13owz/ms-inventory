import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from 'sequelize';
import sequelize from '../utils/sequelize';
import { User } from './user.model';
import { Category } from './category.model';
import { Status } from './status.model';
import { Fund } from './fund.model';
import { Location } from './location.model';

export class Inventory extends Model<
  InferAttributes<Inventory>,
  InferCreationAttributes<Inventory>
> {
  id: CreationOptional<number>;
  track: string;
  code: string;
  oldCode: string;
  description: string;
  unit: string;
  value: number;
  receivedDate: Date;
  remark: string;
  image: string;
  createdAt: CreationOptional<Date>;
  updatedAt: CreationOptional<Date>;
  userId: ForeignKey<User['id']>;
  categoryId: ForeignKey<Category['id']>;
  statusId: ForeignKey<Status['id']>;
  fundId: ForeignKey<Fund['id']>;
  locationId: ForeignKey<Location['id']>;
  user: NonAttribute<User>;
  category: NonAttribute<Category>;
  status: NonAttribute<Status>;
  fund: NonAttribute<Fund>;
  location: NonAttribute<Location>;
}

export default Inventory.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    track: { type: DataTypes.STRING(7), allowNull: false, unique: true },
    code: { type: DataTypes.STRING, allowNull: false, unique: true },
    oldCode: { type: DataTypes.STRING },
    description: { type: DataTypes.TEXT, allowNull: false },
    unit: { type: DataTypes.STRING, allowNull: false },
    value: { type: DataTypes.FLOAT, allowNull: false },
    receivedDate: { type: DataTypes.DATEONLY, allowNull: false },
    remark: { type: DataTypes.TEXT },
    image: { type: DataTypes.TEXT },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: User, key: 'id' },
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Category, key: 'id' },
    },
    statusId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Status, key: 'id' },
    },
    fundId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Fund, key: 'id' },
    },
    locationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Location, key: 'id' },
    },
  },
  {
    indexes: [
      { fields: ['track'] },
      { fields: ['code'] },
      { fields: ['createdAt'] },
    ],
    sequelize,
    modelName: 'Inventory',
    timestamps: true,
  }
);
