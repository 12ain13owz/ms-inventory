import { Router } from 'express';
import {
  createUserController,
  findAllUserController,
  forgotPassworController,
  resetPasswordController,
  updateUserController,
} from '../../controllers/user.controller';
import { validate } from '../../middlewares/validate.middleware';
import { userSchema } from '../../schemas/user.schema';
import {
  isRoleAdmin,
  isUserActive,
  verifyToken,
} from '../../middlewares/auth.middleware';
const router = Router();

router.get('/', [verifyToken, isUserActive], findAllUserController);
router.post(
  '/',
  [verifyToken, isUserActive, isRoleAdmin, validate(userSchema.create)],
  createUserController
);
router.patch(
  '/:id',
  [verifyToken, isUserActive, isRoleAdmin, validate(userSchema.update)],
  updateUserController
);
router.post(
  '/forgot-password',
  [validate(userSchema.forgotPassword)],
  forgotPassworController
);
router.post(
  '/reset-password/:id',
  [validate(userSchema.resetPassword)],
  resetPasswordController
);

export default router;
