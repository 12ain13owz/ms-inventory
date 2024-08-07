import { config } from "../../config";
import { NextFunction, Request } from "express";
import { ExtendedResponse } from "../types/express";
import { omit } from "lodash";
import { AuthType } from "../schemas/auth.schema";
import { userService } from "../services/user.service";
import { newError, comparePassword, normalizeUnique } from "../utils/helper";
import { privateUserFields } from "../models/user.model";
import {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyJwt,
} from "../utils/jwt";

const tokenKey = "refresh_token";
const isProduction = config.get("node_env") === "production";

export async function loginController(
  req: Request<{}, {}, AuthType["login"]>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = "loginController";

  try {
    const email = normalizeUnique(req.body.email);
    const user = await userService.findByEmail(email);
    if (!user) throw newError(404, `ไม่พบ E-mail: ${email}`);

    const isValidPassword = comparePassword(req.body.password, user.password);
    if (!isValidPassword) throw newError(401, "E-mail หรือ Password ไม่ตรงกัน");
    if (!user.active) throw newError(401, `${email} บัญชีนี้ถูกระงับการใช้งาน`);

    const accessToken = signAccessToken(user.id);
    const refreshToken = signRefreshToken(user.id);

    if (!accessToken || !refreshToken)
      throw newError(503, "ระบบไม่สามารถยืนยันตัวตนได้ กรุณาติดต่อ Admin");

    const resUser = omit(user.toJSON(), privateUserFields);
    const expiresCookie = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // milliseconds * seconds * minutes * hours * days

    res.clearCookie(tokenKey);
    res.cookie(tokenKey, refreshToken, {
      path: "/",
      expires: expiresCookie,
      httpOnly: true,
      sameSite: isProduction ? "lax" : "none",
      secure: true,
    });

    res.json({ accessToken, resUser });
  } catch (error) {
    next(error);
  }
}

export async function logoutController(
  req: Request,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = "logoutController";

  try {
    res.clearCookie(tokenKey);
    res.json({ message: "ออกจากระบบสำเร็จ" });
  } catch (error) {
    next(error);
  }
}

export async function refreshTokenController(
  req: Request,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = "refreshTokenController";
  try {
    const accessToken = (req.headers.authorization ?? "").replace(
      /^Bearer\s/,
      ""
    );
    if (!accessToken)
      throw newError(403, "ไม่พบ Token กรุณาเข้าสู่ระบบใหม่ (1)", true);

    const decodedAccessToken = verifyAccessToken(accessToken);
    if (decodedAccessToken && decodedAccessToken !== "jwt expired")
      throw newError(401, "Token หมดอายุ, กรุณาเข้าสู่ระบบใหม่ (2)", true);

    const refreshToken = req.cookies[tokenKey];
    if (!refreshToken)
      throw newError(401, "Token หมดอายุ, กรุณาเข้าสู่ระบบใหม่ (3)", true);

    const decodedRefreshToken = verifyJwt<{ userId: number }>(
      refreshToken,
      "refreshTokenPublicKey"
    );
    if (!decodedRefreshToken)
      throw newError(401, "Token หมดอายุ, กรุณาเข้าสู่ระบบใหม่ (4)", true);

    const user = await userService.findById(decodedRefreshToken.userId);
    if (!user) throw newError(404, "ไม่พบข้อมูลผู้ใช้งานในระบบ", true);

    const newAccessToken = signAccessToken(user.id);
    const newRefreshToken = signRefreshToken(user.id);

    if (!newAccessToken || !newRefreshToken)
      throw newError(503, "ระบบไม่สามารถยืนยันตัวตนได้ กรุณาติดต่อ Admin");

    const expiresCookie = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // milliseconds * seconds * minutes * hours * days
    res.clearCookie(tokenKey);
    res.cookie(tokenKey, newRefreshToken, {
      path: "/",
      expires: expiresCookie,
      httpOnly: true,
      sameSite: isProduction ? "lax" : "none",
      secure: true,
    });
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.clearCookie(tokenKey);
    next(error);
  }
}
