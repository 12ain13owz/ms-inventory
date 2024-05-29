import { NextFunction, Request } from 'express';
import { ExtendedResponse } from '../types/express';
import { omit } from 'lodash';
import { newError, privateFields, removeWhitespace } from '../utils/helper';
import { Category } from '../models/category.model';
import { CategoryType } from '../schemas/category.schema';
import { categoryService } from '../services/category.service';

export async function findAllCategoryController(
  req: Request,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'findAllCategoryController';

  try {
    const resCategories = await categoryService.findAll();
    res.json(resCategories);
  } catch (error) {
    next(error);
  }
}

export async function createCategoryController(
  req: Request<{}, {}, CategoryType['create']>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'createCategoryController';

  try {
    const name = removeWhitespace(req.body.name);
    const category = await categoryService.findByName(name);
    if (category) throw newError(400, `ประเภท ${name} ซ้ำ'`);

    const payload = new Category({
      name: name,
      active: req.body.active,
      remark: req.body.remark || '',
    });
    const result = await categoryService.create(payload);
    const newCagegory = omit(result.toJSON(), privateFields);

    res.json({
      message: `เพิ่มประเภท ${name} สำเร็จ`,
      item: newCagegory,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateCategoryController(
  req: Request<
    CategoryType['update']['params'],
    {},
    CategoryType['update']['body']
  >,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'updateCategoryController';

  try {
    const id = +req.params.id;
    const cateogory = await categoryService.findById(id);
    if (!cateogory) throw newError(400, 'ไม่พบประเภท');

    const name = removeWhitespace(req.body.name);
    const existingCategory = await categoryService.findByName(name);
    if (existingCategory && existingCategory.id !== id)
      throw newError(400, `ประเภท ${name} ซ้ำ'`);

    const payload: Partial<Category> = {
      name: name,
      active: req.body.active,
      remark: req.body.remark || '',
    };
    const [result] = await categoryService.update(id, payload);
    if (!result) throw newError(400, `แก้ไขประเภท ${name} ไม่สำเร็จ`);

    res.json({
      message: `แก้ไขประเภท ${name} สำเร็จ`,
      item: payload,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteCategoryController(
  req: Request<CategoryType['delete']>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'deleteCategoryController';

  try {
    const id = +req.params.id;
    const category = await categoryService.findById(id);
    if (!category) throw newError(400, 'ไม่พบประเภท');

    const name = category.name;
    const result = await categoryService.delete(id);
    if (!result) throw newError(400, `ลบประเภท ${name} ไม่สำเร็จ`);

    res.json({ message: `ลบประเภท ${name} สำเร็จ` });
  } catch (error) {
    next(error);
  }
}
