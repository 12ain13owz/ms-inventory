import { Router } from 'express';
import { validate } from '../../middlewares/validate.middleware';
import {} from '../../schemas/category.schema';
import {
  isRoleAdmin,
  isUserActive,
  verifyToken,
} from '../../middlewares/auth.middleware';

import {
  createUsageStatusController,
  deleteUsageStatusController,
  findAllUsageController,
  updateUsageStatusController,
} from '../../controllers/usage-status.controller';
import { usageStatusSchema } from '../../schemas/usage-status.schema';

const router = Router();

router.get('/', [verifyToken, isUserActive], findAllUsageController);
router.post(
  '/',
  [verifyToken, isUserActive, isRoleAdmin, validate(usageStatusSchema.create)],
  createUsageStatusController
);
router.put(
  '/:id',
  [verifyToken, isUserActive, isRoleAdmin, validate(usageStatusSchema.update)],
  updateUsageStatusController
);
router.delete(
  '/:id',
  [verifyToken, isUserActive, isRoleAdmin, validate(usageStatusSchema.delete)],
  deleteUsageStatusController
);

export default router;
