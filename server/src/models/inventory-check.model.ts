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
import { Inventory } from './inventory.model';

export class InventoryCheck extends Model<
  InferAttributes<InventoryCheck>,
  InferCreationAttributes<InventoryCheck>
> {
  id: CreationOptional<number>;
  year: number;
  createdAt: CreationOptional<Date>;
  inventoryId: ForeignKey<Inventory['id']>;
  Inventory: NonAttribute<Inventory>;
}

export default InventoryCheck.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    year: { type: DataTypes.INTEGER, allowNull: false },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    inventoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Inventory, key: 'id' },
    },
  },
  {
    indexes: [{ fields: ['createdAt'] }, { fields: ['inventoryId'] }],
    sequelize,
    modelName: 'InventoryCheck',
    timestamps: false,
  }
);
