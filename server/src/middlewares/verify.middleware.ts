import { NextFunction, Request, Response } from 'express';
import { LoginUserInput } from '../schemas/use.sehema';

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
