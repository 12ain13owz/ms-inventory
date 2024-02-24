import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { LoginUserInput } from '../schemas/use.sehema';
import { findUserByEmail, findUserById } from '../services/user.service';
import { newError } from '../utils/error';
import { privateUserFields } from '../models/user.model';
import { signAccessToken, signRefreshToken, verifyJwt } from '../utils/jwt';

export async function loginHandler(
  req: Request<{}, {}, LoginUserInput>,
  res: Response,
  next: NextFunction
) {
  res.locals.func = 'loginHandler';

  try {
    const user = await findUserByEmail(req.body.email);
    if (!user) throw newError(404, 'ไม่พบ Email');

    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isValidPassword) throw newError(401, 'Email หรือ Password ไม่ตรงกัน');
    if (!user.active) throw newError(401, 'Email นี้ไม่ได้รับอนุญาติให้ใช้งาน');

    const accessToken = signAccessToken(user, privateUserFields);
    const refreshToken = signRefreshToken(user.id);

    res.json({ accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
}

export async function refreshTokenHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.locals.func = 'refreshTokenHandler';

  try {
    const token = req.headers['x-refresh-token'] as string;
    const decoded = verifyJwt<{ userId: number }>(
      token,
      'refreshTokenPublicKey'
    );
    if (!decoded) throw newError(401, 'Token หมดอายุ, กรุณาเข้าสู่ระบบใหม่');

    const user = await findUserById(decoded.userId);
    if (!user) throw newError(401, 'Token หมดอายุ, กรุณาเข้าสู่ระบบใหม่');

    const accessToken = signAccessToken(user, privateUserFields);
    const refreshToken = signRefreshToken(user.id);

    res.json({ accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
}
