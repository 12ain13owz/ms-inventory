import { Router } from 'express';
import { validate } from '../../middlewares/validate.middleware';
import {
  isRoleAdmin,
  isUserActive,
  verifyToken,
} from '../../middlewares/auth.middleware';
import {
  createFundController,
  deleteFundController,
  findAllFundController,
  updateFundController,
} from '../../controllers/fund.controller';
import { fundSchema } from '../../schemas/fund.schema';

const router = Router();

router.get('/', [verifyToken, isUserActive], findAllFundController);
router.post(
  '/',
  [verifyToken, isUserActive, isRoleAdmin, validate(fundSchema.create)],
  createFundController
);
router.put(
  '/:id',
  [verifyToken, isUserActive, isRoleAdmin, validate(fundSchema.update)],
  updateFundController
);
router.delete(
  '/:id',
  [verifyToken, isUserActive, isRoleAdmin, validate(fundSchema.delete)],
  deleteFundController
);

export default router;
