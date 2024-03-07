import config from 'config';
import { NextFunction, Request } from 'express';
import { ExtendedResponse } from '../types/express';
import { omit } from 'lodash';
import { LoginUserInput } from '../schemas/auth.schema';
import { findUserByEmail, findUserById } from '../services/user.service';
import { newError, comparePassword, normalizeUnique } from '../utils/helper';
import { privateUserFields } from '../models/user.model';
import { signAccessToken, signRefreshToken, verifyJwt } from '../utils/jwt';

const tokenKey = 'refresh_token';
const expiresCookie = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // milliseconds * seconds * minutes * hours * days

export async function loginHandler(
  req: Request<{}, {}, LoginUserInput>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'loginHandler';

  try {
    const email = normalizeUnique(req.body.email);
    const user = await findUserByEmail(email);
    if (!user) throw newError(404, 'ไม่พบ E-mail');

    const isValidPassword = comparePassword(req.body.password, user.password);
    if (!isValidPassword) throw newError(401, 'E-mail หรือ Password ไม่ตรงกัน');
    if (!user.active)
      throw newError(401, 'E-mail นี้ไม่ได้รับอนุญาติให้ใช้งาน');

    const accessToken = signAccessToken(user.id!);
    const refreshToken = signRefreshToken(user.id!);
    const payload = omit(user.dataValues, privateUserFields);

    res.clearCookie(tokenKey);
    res.cookie(tokenKey, refreshToken, {
      path: '/',
      expires: expiresCookie,
      httpOnly: true,
      sameSite: 'lax',
      secure: config.get<string>('node_env') === 'production',
    });

    res.json({ accessToken, payload });
  } catch (error) {
    next(error);
  }
}

export async function logoutHandler(
  req: Request,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'logoutHandler';

  try {
    res.clearCookie(tokenKey);
    res.json({ message: 'ออกจากระบบสำเร็จ' });
  } catch (error) {
    next(error);
  }
}

export async function refreshTokenHandler(
  req: Request,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'refreshTokenHandler';

  try {
    const token = req.cookies[tokenKey];
    if (!token)
      throw newError(401, 'Token หมดอายุ, กรุณาเข้าสู่ระบบใหม่', true);

    const decoded = verifyJwt<{ userId: number }>(
      token,
      'refreshTokenPublicKey'
    );
    if (!decoded)
      throw newError(401, 'Token หมดอายุ, กรุณาเข้าสู่ระบบใหม่', true);

    const user = await findUserById(decoded.userId);
    if (!user) throw newError(404, 'ไม่พบข้อมูลผู้ใช้งานในระบบ', true);

    const accessToken = signAccessToken(user.id!);
    const refreshToken = signRefreshToken(user.id!);

    res.clearCookie(tokenKey);
    res.cookie(tokenKey, refreshToken, {
      path: '/',
      expires: expiresCookie,
      httpOnly: true,
      sameSite: 'lax',
      secure: config.get<string>('node_env') === 'production',
    });
    res.json({ accessToken });
  } catch (error) {
    next(error);
  }
}
