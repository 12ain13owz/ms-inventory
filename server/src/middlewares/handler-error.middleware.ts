import { NextFunction, Request, Response } from "express";
import log from "../utils/logger";

interface ResponseError extends Error {
  status?: number;
}

const handlerError = async (
  error: ResponseError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const message = error.message || "Internal Server Error!";
    const status = error.status || 500;
    const func = res.locals.func;

    log.error(`${func}: ${message}`);
    res.status(status).json({ message });
  } catch (error) {
    res.sendStatus(500);
  }
};

export default handlerError;
