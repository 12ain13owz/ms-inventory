import { NextFunction, Request } from 'express';
import { ExtendedResponse } from '../types/express';
import { newError } from '../utils/helper';
import { verifyJwt } from '../utils/jwt';
import { findUserById } from '../services/user.service';

interface decodeUser {
  userId: number;
  iat: number;
  exp: number;
}

export async function verifyToken(
  req: Request<unknown>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'verifyToken';
  try {
    const accessToken = (req.headers.authorization || '').replace(
      /^Bearer\s/,
      ''
    );
    if (!accessToken)
      throw newError(403, 'ไม่พบ Token กรุณาเข้าสู่ระบบใหม่', true);

    const decoded = verifyJwt<decodeUser>(accessToken, 'accessTokenPublicKey');
    if (!decoded)
      throw newError(401, 'Token หมดอายุ, กรุณาเข้าสู่ระบบใหม่', true);

    res.locals.userId = decoded!.userId;
    next();
  } catch (error) {
    next(error);
  }
}

export async function isUserActive(
  req: Request<unknown>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'isUserActive';

  try {
    const user = await findUserById(res.locals.userId!);
    if (!user) throw newError(404, 'ไม่พบข้อมูลผู้ใช้งานในระบบ', true);
    if (!user.active)
      throw newError(401, 'บัญชีนี้ไม่ได้รับอนุญาติให้ใช้งาน', true);

    res.locals.user = user.dataValues;
    next();
  } catch (error) {
    next(error);
  }
}

export async function isRoleAdmin(
  req: Request<unknown>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'isRoleAdmin';

  try {
    if (res.locals.user!.role !== 'admin')
      throw newError(401, 'บัญชีนี้ไม่ได้รับอนุญาติให้ใช้งาน');

    next();
  } catch (error) {
    next(error);
  }
}
