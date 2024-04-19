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
  receivedDate: Date;
  detail: string;
  quantity: number;
  modifyQuantity: number;
  firstname: string;
  lastname: string;
  categoryName: string;
  statusName: string;
  remark: string;
  image: string;
  newParcel: boolean;
  increaseQuantity: boolean;
  decreaseQuantity: boolean;
  print: boolean;
  printCount: number;
  detailLog: string;
  createdAt: CreationOptional<Date>;
  updatedAt: CreationOptional<Date>;
}

export default Log.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    track: { type: DataTypes.STRING, allowNull: false },
    code: { type: DataTypes.STRING },
    oldCode: { type: DataTypes.STRING },
    receivedDate: { type: DataTypes.DATEONLY },
    detail: { type: DataTypes.STRING },
    quantity: { type: DataTypes.NUMBER },
    modifyQuantity: { type: DataTypes.NUMBER },
    firstname: { type: DataTypes.STRING },
    lastname: { type: DataTypes.STRING },
    categoryName: { type: DataTypes.STRING },
    statusName: { type: DataTypes.TEXT },
    remark: { type: DataTypes.STRING },
    image: { type: DataTypes.STRING },
    newParcel: { type: DataTypes.BOOLEAN },
    increaseQuantity: { type: DataTypes.BOOLEAN },
    decreaseQuantity: { type: DataTypes.BOOLEAN },
    print: { type: DataTypes.BOOLEAN },
    printCount: { type: DataTypes.NUMBER },
    detailLog: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE },
  },
  {
    indexes: [{ fields: ['track'] }],
    sequelize,
    modelName: 'Log',
    timestamps: true,
  }
);
