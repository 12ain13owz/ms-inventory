import { Response } from 'express';
import { InferAttributes } from 'sequelize';
import { User } from '../models/user.model';

interface CustomResponseLocals {
  func: string;
  userId: number;
  user: InferAttributes<User, { omit: never }>;
}

type ExtendedResponse = Response & { locals: Partial<CustomResponseLocals> };
