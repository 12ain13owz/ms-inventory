import { NextFunction, Request } from "express";
import { ExtendedResponse } from "../types/express";
import { omit } from "lodash";
import { newError, privateFields, removeWhitespace } from "../utils/helper";
import { Fund } from "../models/fund.model";
import { FundType } from "../schemas/fund.schema";
import { fundService } from "../services/fund.service";

export async function findAllFundController(
  req: Request,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = "findAllFundController";

  try {
    const funds = await fundService.findAll();
    res.json(funds);
  } catch (error) {
    next(error);
  }
}

export async function createFundController(
  req: Request<{}, {}, FundType["create"]>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = "createFundController";

  try {
    const name = removeWhitespace(req.body.name);
    const fund = await fundService.findByName(name);
    if (fund) throw newError(400, `แหล่งเงิน ${name} ซ้ำ`);

    const payload = new Fund({
      name: name,
      active: req.body.active,
      remark: req.body.remark ?? "",
    });
    const result = await fundService.create(payload);
    const newFund = omit(result.toJSON(), privateFields);

    res.json({
      message: `เพิ่มแหล่งเงิน ${name} สำเร็จ`,
      item: newFund,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateFundController(
  req: Request<FundType["update"]["params"], {}, FundType["update"]["body"]>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = "updateFundController";

  try {
    const id = +req.params.id;
    const fund = await fundService.findById(id);
    if (!fund) throw newError(400, "ไม่พบแหล่งเงิน");

    const name = removeWhitespace(req.body.name);
    const existingFund = await fundService.findByName(name);
    if (existingFund && existingFund.id !== id)
      throw newError(400, `แหล่งเงิน ${name} ซ้ำ`);

    const payload: Partial<Fund> = {
      name: name,
      active: req.body.active,
      remark: req.body.remark ?? "",
    };
    const [result] = await fundService.update(id, payload);
    if (!result) throw newError(400, `แก้ไขแหล่งเงิน ${name} ไม่สำเร็จ`);

    res.json({
      message: `แก้ไขแหล่งเงิน ${name} สำเร็จ`,
      item: payload,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteFundController(
  req: Request<FundType["delete"]>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = "deleteFundController";

  try {
    const id = +req.params.id;
    const fund = await fundService.findById(id);
    if (!fund) throw newError(400, "ไม่พบแหล่งเงิน ที่ต้องการลบ");

    const name = fund.name;
    const result = await fundService.delete(id);
    if (!result) throw newError(400, `ลบแหล่งเงิน ${name} ไม่สำเร็จ`);

    res.json({ message: `ลบแหล่งเงิน ${name} สำเร็จ` });
  } catch (error) {
    next(error);
  }
}
