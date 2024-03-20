import {
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
  id?: number;
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
  printCount: number;
  addParcel: boolean;
  addQuantity: boolean;
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
    printCount: { type: DataTypes.NUMBER },
    addParcel: { type: DataTypes.BOOLEAN },
    addQuantity: { type: DataTypes.BOOLEAN },
  },
  {
    indexes: [{ fields: ['code', 'track'] }],
    sequelize,
    modelName: 'Log',
    timestamps: true,
  }
);
