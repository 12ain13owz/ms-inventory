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
  editParcel: boolean;
  increaseQuantity: boolean;
  decreaseQuantity: boolean;
  print: boolean;
  printCount: number;
  detailLog: string;
  createdAt: CreationOptional<Date>;
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
    detail: { type: DataTypes.TEXT },
    quantity: { type: DataTypes.NUMBER },
    modifyQuantity: { type: DataTypes.NUMBER },
    firstname: { type: DataTypes.STRING },
    lastname: { type: DataTypes.STRING },
    categoryName: { type: DataTypes.STRING },
    statusName: { type: DataTypes.STRING },
    remark: { type: DataTypes.TEXT },
    image: { type: DataTypes.TEXT },
    newParcel: { type: DataTypes.BOOLEAN },
    editParcel: { type: DataTypes.BOOLEAN },
    increaseQuantity: { type: DataTypes.BOOLEAN },
    decreaseQuantity: { type: DataTypes.BOOLEAN },
    print: { type: DataTypes.BOOLEAN },
    printCount: { type: DataTypes.NUMBER },
    detailLog: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE },
  },
  {
    indexes: [
      { fields: ['track'] },
      { fields: ['code'] },
      { fields: ['createdAt'] },
    ],
    sequelize,
    modelName: 'Log',
    timestamps: true,
    updatedAt: false,
  }
);
