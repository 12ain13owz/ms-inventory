import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from 'sequelize';
import sequelize from '../utils/sequelize';
import { User } from './user.model';
import { Category } from './category.model';
import { Status } from './status.model';

export class Parcel extends Model<
  InferAttributes<Parcel>,
  InferCreationAttributes<Parcel>
> {
  id: CreationOptional<number>;
  track: string;
  code: string;
  oldCode: string;
  receivedDate: Date;
  detail: string;
  quantity: number;
  print: boolean;
  remark: string;
  image: string;
  UserId: ForeignKey<User['id']>;
  CategoryId: ForeignKey<Category['id']>;
  StatusId: ForeignKey<Status['id']>;
  createdAt: CreationOptional<Date>;
  updatedAt: CreationOptional<Date>;
  User: NonAttribute<User>;
  Category: NonAttribute<Category>;
  Status: NonAttribute<Status>;
}

export default Parcel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    track: {
      type: DataTypes.STRING(12),
      allowNull: false,
      unique: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    oldCode: {
      type: DataTypes.STRING,
    },
    receivedDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    detail: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    print: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    remark: {
      type: DataTypes.TEXT,
    },
    image: {
      type: DataTypes.TEXT,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    indexes: [{ fields: ['code', 'track'] }],
    sequelize,
    modelName: 'Parcel',
    timestamps: true,
  }
);

export interface ParcelData {
  id: number;
  track: string;
  code: string;
  oldCode: string;
  receivedDate: Date;
  detail: string;
  quantity: number;
  print: boolean;
  remark: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
  User: { firstname: string; lastname: string };
  Category: { id: number; name: string };
  Status: { id: number; name: string };
}
