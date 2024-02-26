import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import sequelize from '../utils/sequelize';

export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  id: number;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  role: 'admin' | 'user';
  active: boolean;
  remark: string;
}

export default User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstname: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin', 'user'),
      allowNull: false,
      defaultValue: 'user',
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    remark: {
      type: DataTypes.STRING,
    },
  },
  {
    indexes: [{ unique: true, fields: ['email'] }],
    sequelize,
    modelName: 'User',
    timestamps: true,
  }
);

export const privateUserToken = [
  'password',
  'active',
  'remark',
  'createdAt',
  'updatedAt',
];

export const privateUserFields = ['password', 'createdAt', 'updatedAt'];
