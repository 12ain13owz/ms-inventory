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
  [validate(creatCategorySchema), verifyToken, isUserActive, isRoleAdmin],
  createStatusHandler
);
router.put(
  '/:id',
  [validate(updateCategorySchema), verifyToken, isUserActive, isRoleAdmin],
  updateStatusHandler
);
router.delete(
  '/:id',
  [validate(deleteCategorySchema), verifyToken, isUserActive, isRoleAdmin],
  deleteStatudHandler
);

export default router;
