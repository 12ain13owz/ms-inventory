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
  [validate(creatCategorySchema), verifyToken, isUserActive, isRoleAdmin],
  createCategoryHandler
);
router.put(
  '/:id',
  [validate(updateCategorySchema), verifyToken, isUserActive, isRoleAdmin],
  updateCategoryHandler
);
router.delete(
  '/:id',
  [validate(deleteCategorySchema), verifyToken, isUserActive, isRoleAdmin],
  deleteCategoryHandler
);

export default router;
