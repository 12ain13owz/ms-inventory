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

export function findUserByEmail(email: string) {
  return UserModel.findOne({ where: { email } });
}

export function findAllUser() {
  return UserModel.findAll();
}

export function updateUser(id: number, user: Partial<User>) {
  return UserModel.update(user, { where: { id } });
}

export function updateUserPassword(id: number, password: string) {
  return UserModel.update({ password }, { where: { id } });
}
