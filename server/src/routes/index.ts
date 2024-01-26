import { NextFunction, Request, Response, Router } from "express";

const router = Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.sendStatus(200);
});

router.get("/error", (req: Request, res: Response, next: NextFunction) => {
  try {
    res.locals.func = "Test Function Error";
    throw Object.assign(new Error("Test message error"), { status: 400 });
  } catch (error) {
    next(error);
  }
});

export default router;
