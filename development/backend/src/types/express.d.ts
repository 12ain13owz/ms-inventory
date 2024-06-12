import { Response } from 'express';
import { InferAttributes } from 'sequelize';
import { User } from '../models/user.model';

interface CustomResponseLocals {
  func: string;
  userId: number;
  user: InferAttributes<User, { omit: never }>;
  image: string[];
}

type ExtendedResponse = Response & { locals: Partial<CustomResponseLocals> };
