import { Router } from 'express';
import { validate } from '../../middlewares/validate.middleware';
import {
  isRoleAdmin,
  isUserActive,
  verifyToken,
} from '../../middlewares/auth.middleware';
import {
  createStatusController,
  deleteStatusController,
  findAllStatusController,
  updateStatusController,
} from '../../controllers/status.controller';
import { statusSchema } from '../../schemas/status.schema';

const router = Router();

router.get('/', [verifyToken, isUserActive], findAllStatusController);
router.post(
  '/',
  [verifyToken, isUserActive, isRoleAdmin, validate(statusSchema.create)],
  createStatusController
);
router.put(
  '/:id',
  [verifyToken, isUserActive, isRoleAdmin, validate(statusSchema.update)],
  updateStatusController
);
router.delete(
  '/:id',
  [verifyToken, isUserActive, isRoleAdmin, validate(statusSchema.delete)],
  deleteStatusController
);

export default router;
