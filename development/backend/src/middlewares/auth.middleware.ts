import { config } from "../../config";
import { NextFunction, Request } from "express";
import { ExtendedResponse } from "../types/express";
import { newError } from "../utils/helper";
import { verifyJwt } from "../utils/jwt";
import { userService } from "../services/user.service";
import { AuthType } from "../schemas/auth.schema";

interface decodeUser {
  userId: number;
  iat: number;
  exp: number;
}

export async function verifyRecaptcha(
  req: Request<{}, {}, AuthType["login"]>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = "verifyRecaptcha";

  const node_env = config.get("node_env");
  if (node_env === "development") return next();

  try {
    const secretKey = config.get("recaptcha").secretKey;
    const recaptcha = req.body.recaptcha;
    const url = "https://www.google.com/recaptcha/api/siteverify";

    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        secret: secretKey,
        response: recaptcha,
        remoteip: req.ip,
      }),
    });

    if (response.status !== 200)
      throw newError(
        response.status,
        "ไม่อนุญาติให้เข้าสู่ระบบ เนื่องจากการตรวจสอบ reCAPTCHA ไม่สำเร็จ"
      );

    next();
  } catch (error) {
    next(error);
  }
}

export async function verifyToken(
  req: Request<unknown>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = "verifyToken";
  try {
    const accessToken = (req.headers.authorization ?? "").replace(
      /^Bearer\s/,
      ""
    );
    if (!accessToken)
      throw newError(403, "ไม่พบ Token กรุณาเข้าสู่ระบบใหม่", true);

    const decoded = verifyJwt<decodeUser>(accessToken, "accessTokenPublicKey");
    if (!decoded)
      throw newError(401, "Token หมดอายุ, กรุณาเข้าสู่ระบบใหม่", true);

    res.locals.userId = decoded.userId;
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
  res.locals.func = "isUserActive";

  try {
    const user = await userService.findById(res.locals.userId!);
    if (!user) throw newError(404, "ไม่พบข้อมูลผู้ใช้งานในระบบ", true);
    if (!user.active)
      throw newError(401, `${user.email} บัญชีนี้ถูกระงับการใช้งาน`, true);

    res.locals.user = user.toJSON();
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
  res.locals.func = "isRoleAdmin";

  try {
    if (res.locals.user!.role !== "admin")
      throw newError(
        401,
        `${res.locals.user!.email} บัญชีนี้ไม่มีสิทธิ์เข้าถึงเนื้อหานี้`
      );

    next();
  } catch (error) {
    next(error);
  }
}
