import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
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

      const e = Object.assign(new Error(message), { status });
      next(e);
    }
  };
