import UserModel, { User } from '../models/user.model';

export const userService = {
  findAll(): Promise<User[]> {
    return UserModel.findAll({ ...queryOptions() });
  },

  findById(id: number): Promise<User | null> {
    return UserModel.findByPk(id);
  },

  findByEmail(email: string): Promise<User | null> {
    return UserModel.findOne({ where: { email } });
  },

  create(user: User): Promise<User> {
    return UserModel.create(user.toJSON());
  },

  update(id: number, user: Partial<User>): Promise<[affectedCount: number]> {
    return UserModel.update(user, { where: { id } });
  },

  changePassword(
    id: number,
    password: string
  ): Promise<[affectedCount: number]> {
    return UserModel.update({ password }, { where: { id } });
  },

  resetPassword(
    id: number,
    password: string
  ): Promise<[affectedCount: number]> {
    return UserModel.update(
      { password: password, passwordResetCode: null, passwordExpired: null },
      { where: { id } }
    );
  },
};

function queryOptions() {
  return {
    attributes: {
      exclude: [
        'password',
        'passwordResetCode',
        'passwordExpired',
        'createdAt',
        'updatedAt',
      ],
    },
  };
}
