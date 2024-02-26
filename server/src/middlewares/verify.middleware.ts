import { NextFunction, Request, Response } from 'express';
import { LoginUserInput } from '../schemas/auth.schema';
import { newError } from '../utils/error';
import { verifyJwt } from '../utils/jwt';

interface decodeUser {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  role: string;
  iat: number;
}

export async function verifyToken(
  req: Request<unknown>,
  res: Response,
  next: NextFunction
) {
  res.locals.func = 'verifyToken';

  try {
    const accessToken = (req.headers.authorization || '').replace(
      /^Bearer\s/,
      ''
    );
    if (!accessToken) newError(403, 'ไม่พบ Token กรุณาเข้าสู่ระบบใหม่', true);

    const decoded = verifyJwt<decodeUser>(accessToken, 'accessTokenPublicKey');
    if (!decoded)
      throw newError(401, 'Token หมดอายุ, กรุณาเข้าสู่ระบบใหม่', true);

    res.locals.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
}

export async function verifyReceptcha(
  req: Request<{}, {}, LoginUserInput>,
  res: Response,
  next: NextFunction
) {
  res.locals.func = 'verifyReceptcha';
  try {
    // const receptchaUrl = config.recaptchaUrl;
    // const payload = {
    //   secret: config.recaptcha.siteKey,
    //   response: req.body.receptchaToken,
    // };
    // const response = await fetch(receptchaUrl, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(payload),
    // }).then((data) => data.json());
    // console.log(response);

    next();
  } catch (error) {
    next(error);
  }
}
