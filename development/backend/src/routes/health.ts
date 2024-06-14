import { NextFunction, Request, Response, Router } from "express";
import { newError } from "../utils/helper";

const router = Router();

router.get("/health", (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "health check" });
});

router.get("/error", (req: Request, res: Response, next: NextFunction) => {
  res.locals.func = "Test Function Error";

  try {
    throw newError(400, "Test message error!");
  } catch (error) {
    next(error);
  }
});

export default router;
