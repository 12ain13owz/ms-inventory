import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import sequelize from '../utils/sequelize';

export class Parcel extends Model<
  InferAttributes<Parcel>,
  InferCreationAttributes<Parcel>
> {
  id?: number;
  code: string;
  oldCode: string;
  track: string;
  receivedDate: Date;
  detail: string;
  print: boolean; // เคยปริ้น Barcode แล้วหรือไม่
  status: boolean; // สถานะ stock ตัด/ไม่ตัด
  remark: string;
  image: string;
  active: boolean;
}

export default Parcel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    oldCode: {
      type: DataTypes.STRING,
    },
    track: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    receivedDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    detail: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    print: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    status: {
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
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    indexes: [{ unique: true, fields: ['code', 'track'] }],
    sequelize,
    modelName: 'Parcel',
    timestamps: true,
  }
);
