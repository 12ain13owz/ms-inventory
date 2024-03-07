import { NextFunction, Request } from 'express';
import { ExtendedResponse } from '../types/express';
import { AnyZodObject, ZodError } from 'zod';
import { newError } from '../utils/helper';

export const validate =
  (schema: AnyZodObject) =>
  (req: Request<unknown>, res: ExtendedResponse, next: NextFunction) => {
    res.locals.func = 'validate';

    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      let message = 'Validate Error';
      let status = 500;

      if (error instanceof ZodError) {
        message = error.issues.map((issue) => issue.message).join(', ');
        status = 400;
      }

      next(newError(status, message));
    }
  };
