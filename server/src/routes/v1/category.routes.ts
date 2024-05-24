import { Router } from 'express';
import { validate } from '../../middlewares/validate.middleware';
import { categorySehema } from '../../schemas/category.schema';
import {
  isRoleAdmin,
  isUserActive,
  verifyToken,
} from '../../middlewares/auth.middleware';
import {
  createCategoryController,
  deleteCategoryController,
  findAllCategoryController,
  updateCategoryController,
} from '../../controllers/category.controller';

const router = Router();

router.get('/', [verifyToken, isUserActive], findAllCategoryController);
router.post(
  '/',
  [verifyToken, isUserActive, isRoleAdmin, validate(categorySehema.create)],
  createCategoryController
);
router.put(
  '/:id',
  [verifyToken, isUserActive, isRoleAdmin, validate(categorySehema.update)],
  updateCategoryController
);
router.delete(
  '/:id',
  [verifyToken, isUserActive, isRoleAdmin, validate(categorySehema.delete)],
  deleteCategoryController
);

export default router;
