import { Router } from 'express';
import { validate } from '../../middlewares/validate.middleware';
import {
  creatCategorySchema,
  deleteCategorySchema,
  updateCategorySchema,
} from '../../schemas/category.schema';
import {
  isRoleAdmin,
  isUserActive,
  verifyToken,
} from '../../middlewares/auth.middleware';
import {
  createCategoryHandler,
  deleteCategoryHandler,
  getAllCategoryHandler,
  updateCategoryHandler,
} from '../../controllers/category.controller';

const router = Router();

router.get('/', [verifyToken, isUserActive], getAllCategoryHandler);
router.post(
  '/',
  [verifyToken, isUserActive, isRoleAdmin, validate(creatCategorySchema)],
  createCategoryHandler
);
router.put(
  '/:id',
  [verifyToken, isUserActive, isRoleAdmin, validate(updateCategorySchema)],
  updateCategoryHandler
);
router.delete(
  '/:id',
  [verifyToken, isUserActive, isRoleAdmin, validate(deleteCategorySchema)],
  deleteCategoryHandler
);

export default router;
