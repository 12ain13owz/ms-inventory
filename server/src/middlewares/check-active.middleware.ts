import { Request, NextFunction } from 'express';
import { categoryService } from '../services/category.service';
import { statusService } from '../services/status.service';
import { fundService } from '../services/fund.service';
import { locationService } from '../services/location.service';
import { ExtendedResponse } from '../types/express';

export async function checkCategoryActive(
  req: Request,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'checkCategoryActive';

  try {
    const categoryId = +req.body.categoryId;
    const category = await categoryService.findById(categoryId);
    if (!category || !category.active) {
      return res.status(400).json({ message: 'ประเภทนี้ไม่สามารถใช้งานได้' });
    }
    next();
  } catch (error) {
    next(error);
  }
}

export async function checkStatusActive(
  req: Request,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'checkStatusActive';

  try {
    const statusId = +req.body.statusId;
    const status = await statusService.findById(statusId);
    if (!status || !status.active) {
      return res.status(400).json({ message: 'สถานะนี้ไม่สามารถใช้งานได้' });
    }
    next();
  } catch (error) {
    next(error);
  }
}

export async function checkFundActive(
  req: Request,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'checkFundActive';

  try {
    const fundId = +req.body.fundId;
    const fund = await fundService.findById(fundId);
    if (!fund || !fund.active) {
      return res
        .status(400)
        .json({ message: 'แหล่งเงินนี้ไม่สามารถใช้งานได้' });
    }
    next();
  } catch (error) {
    next(error);
  }
}

export async function checkLocationActive(
  req: Request,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'checkLocationActive';

  try {
    const locationId = +req.body.locationId;
    const location = await locationService.findById(locationId);
    if (!location || !location.active) {
      return res.status(400).json({ message: 'ห้องนี้ไม่สามารถใช้งานได้' });
    }
    next();
  } catch (error) {
    next(error);
  }
}
