import userModel, { User } from '../models/user.model';

export function findAllUser(): Promise<User[]> {
  return userModel.findAll({
    attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
  });
}

export function findUserById(id: number): Promise<User | null> {
  return userModel.findByPk(id);
}

export function findUserByEmail(email: string): Promise<User | null> {
  return userModel.findOne({ where: { email } });
}

export function createUser(user: User): Promise<User> {
  return userModel.create(user.toJSON());
}

export function updateUser(
  id: number,
  user: Partial<User>
): Promise<[affectedCount: number]> {
  return userModel.update(user, { where: { id } });
}

export function updateUserPassword(
  id: number,
  password: string
): Promise<[affectedCount: number]> {
  return userModel.update({ password }, { where: { id } });
}
