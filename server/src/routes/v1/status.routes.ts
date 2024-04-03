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
  createStatusHandler,
  deleteStatudHandler,
  getAllStatusHandler,
  updateStatusHandler,
} from '../../controllers/status.controller';

const router = Router();

router.get('/', [verifyToken, isUserActive], getAllStatusHandler);
router.post(
  '/',
  [verifyToken, isUserActive, isRoleAdmin, validate(creatCategorySchema)],
  createStatusHandler
);
router.put(
  '/:id',
  [verifyToken, isUserActive, isRoleAdmin, validate(updateCategorySchema)],
  updateStatusHandler
);
router.delete(
  '/:id',
  [verifyToken, isUserActive, isRoleAdmin, validate(deleteCategorySchema)],
  deleteStatudHandler
);

export default router;
