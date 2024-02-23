import { NextFunction, Request, Response } from 'express';
import { catchError, throwError } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { LoginUserInput } from '../schemas/use.sehema';
import config from '../../config';

export async function verifyReceptcha(
  req: Request<{}, {}, LoginUserInput>,
  res: Response,
  next: NextFunction
) {
  res.locals.func = 'verifyReceptcha';
  try {
    const receptchaUrl = config.recaptchaUrl;
    const payload = {
      secret: config.recaptcha.siteKey,
      response: req.body.receptchaToken,
    };

    const response = await fetch(receptchaUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then((data) => data.json());

    console.log(payload);
    console.log(response);

    // const verify$ = ajax({
    //   url: receptchaUrl,
    //   method: 'POST',
    //   body: payload,
    //   responseType: 'json',
    // }).pipe(catchError((error) => throwError(() => error)));

    // let subscription = verify$.subscribe({
    //   next: (response) => {
    //     console.log('Verify Next:', response);
    //     next();
    //   },
    //   error: (error) => {
    //     console.log('Verify Error', error.message);
    //     const e = Object.assign(new Error(error.message), {
    //       status: 401,
    //     });

    //     next(e);
    //   },
    //   complete: () => {
    //     subscription.unsubscribe();
    //   },
    // });
    next();
  } catch (error) {
    next(error);
  }
}
