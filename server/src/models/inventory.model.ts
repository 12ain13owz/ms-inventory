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
import { AssetStatus } from './asset-status.model';
import { UsageStatus } from './usage-status.model';

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
  fundingSource: string;
  location: string;
  remark: string;
  image: string;
  createdAt: CreationOptional<Date>;
  updatedAt: CreationOptional<Date>;
  userId: ForeignKey<User['id']>;
  categoryId: ForeignKey<Category['id']>;
  assetStatusId: ForeignKey<AssetStatus['id']>;
  usageStatusId: ForeignKey<UsageStatus['id']>;
  user: NonAttribute<User>;
  category: NonAttribute<Category>;
  assetStatus: NonAttribute<AssetStatus>;
  usageStatus: NonAttribute<UsageStatus>;
}

export default Inventory.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    track: { type: DataTypes.STRING(12), allowNull: false, unique: true },
    code: { type: DataTypes.STRING, allowNull: false, unique: true },
    oldCode: { type: DataTypes.STRING },
    description: { type: DataTypes.TEXT, allowNull: false },
    unit: { type: DataTypes.STRING, allowNull: false },
    value: { type: DataTypes.FLOAT, allowNull: false },
    receivedDate: { type: DataTypes.DATEONLY, allowNull: false },
    fundingSource: { type: DataTypes.STRING, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false },
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
    assetStatusId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: AssetStatus, key: 'id' },
    },
    usageStatusId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: UsageStatus, key: 'id' },
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
