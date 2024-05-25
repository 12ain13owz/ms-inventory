import { Router } from 'express';
import { validate } from '../../middlewares/validate.middleware';
import {
  isRoleAdmin,
  isUserActive,
  verifyToken,
} from '../../middlewares/auth.middleware';
import {
  createUsageController,
  deleteUsageController,
  findAllUsageController,
  updateUsageController,
} from '../../controllers/usage.controller';
import { usageSchema } from '../../schemas/usage.schema';

const router = Router();

router.get('/', [verifyToken, isUserActive], findAllUsageController);
router.post(
  '/',
  [verifyToken, isUserActive, isRoleAdmin, validate(usageSchema.create)],
  createUsageController
);
router.put(
  '/:id',
  [verifyToken, isUserActive, isRoleAdmin, validate(usageSchema.update)],
  updateUsageController
);
router.delete(
  '/:id',
  [verifyToken, isUserActive, isRoleAdmin, validate(usageSchema.delete)],
  deleteUsageController
);

export default router;
