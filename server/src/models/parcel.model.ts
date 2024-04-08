import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import sequelize from '../utils/sequelize';
import userModel from './user.model';
import categoryModel from './category.model';
import statusModel from './status.model';

export class Parcel extends Model<
  InferAttributes<Parcel>,
  InferCreationAttributes<Parcel>
> {
  id?: number;
  track: string;
  code: string;
  oldCode: string;
  receivedDate: Date;
  detail: string;
  quantity: number;
  print: boolean;
  remark: string;
  image: string;
  UserId: number;
  CategoryId: number;
  StatusId: number;
  createdAt?: Date;
  updatedAt?: Date;
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
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: false,
      references: {
        model: userModel,
        key: 'id',
      },
    },
    CategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: categoryModel,
        key: 'id',
      },
    },
    StatusId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: statusModel,
        key: 'id',
      },
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

export interface ParcelData
  extends Model<
    InferAttributes<ParcelData>,
    InferCreationAttributes<ParcelData>
  > {
  id?: number;
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
