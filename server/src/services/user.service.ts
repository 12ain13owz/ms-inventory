import { Transaction } from 'sequelize';
import UserModel, { User } from '../models/user.model';

export function createUser(user: User, t?: Transaction): Promise<User> {
  return UserModel.create(user.dataValues, {
    transaction: t,
  });
}

export function findUserById(id: number): Promise<User | null> {
  return UserModel.findByPk(id);
}

export function findUserByEmail(email: string): Promise<User | null> {
  return UserModel.findOne({ where: { email } });
}

export function findAllUser(): Promise<User[]> {
  return UserModel.findAll();
}

export function updateUser(
  id: number,
  user: Partial<User>
): Promise<[affectedCount: number]> {
  return UserModel.update(user, { where: { id } });
}

export function updateUserPassword(
  id: number,
  password: string
): Promise<[affectedCount: number]> {
  return UserModel.update({ password }, { where: { id } });
}
