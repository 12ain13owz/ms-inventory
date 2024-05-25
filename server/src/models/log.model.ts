import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import sequelize from '../utils/sequelize';

export class Log extends Model<
  InferAttributes<Log>,
  InferCreationAttributes<Log>
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
  isCreated: boolean;
  firstname: string;
  lastname: string;
  categoryName: string;
  statusName: string;
  usageName: string;
  createdAt: CreationOptional<Date>;
}

export default Log.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    track: { type: DataTypes.STRING(12), allowNull: false },
    code: { type: DataTypes.STRING, allowNull: false },
    oldCode: { type: DataTypes.STRING },
    description: { type: DataTypes.TEXT, allowNull: false },
    unit: { type: DataTypes.STRING, allowNull: false },
    value: { type: DataTypes.FLOAT, allowNull: false },
    receivedDate: { type: DataTypes.DATEONLY, allowNull: false },
    fundingSource: { type: DataTypes.STRING, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false },
    remark: { type: DataTypes.TEXT },
    image: { type: DataTypes.TEXT },
    isCreated: { type: DataTypes.BOOLEAN, allowNull: false },
    firstname: { type: DataTypes.STRING, allowNull: false },
    lastname: { type: DataTypes.STRING, allowNull: false },
    categoryName: { type: DataTypes.STRING, allowNull: false },
    statusName: { type: DataTypes.STRING, allowNull: false },
    usageName: { type: DataTypes.STRING, allowNull: false },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    indexes: [
      { fields: ['track'] },
      { fields: ['code'] },
      { fields: ['createdAt'] },
    ],
    sequelize,
    modelName: 'Log',
    timestamps: false,
  }
);

export interface PropertyLog {
  track: string;
  value: number;
  receivedDate: Date;
  image: string;
  isCreated: boolean;
  firstname: string;
  lastname: string;
  categoryName: string;
  statusName: string;
  usageName: string;
}
