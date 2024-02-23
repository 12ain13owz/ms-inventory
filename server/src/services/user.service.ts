import { Transaction } from 'sequelize';
import UserModel, { User } from '../models/user.model';

export function createUser(user: User, t?: Transaction) {
  return UserModel.create(user.dataValues, {
    transaction: t,
  });
}

export function findUserById(id: number) {
  return UserModel.findByPk(id);
}
