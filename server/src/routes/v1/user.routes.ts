import { Router } from 'express';
import {
  createUserHandler,
  forgotPasswordHandler,
  getAllUserHandler,
  resetPasswordHandler,
  updateUserHandler,
} from '../../controllers/user.controller';
import { validate } from '../../middlewares/validate.middleware';
import {
  createUserSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateUserSchema,
} from '../../schemas/user.schema';
import {
  isRoleAdmin,
  isUserActive,
  verifyToken,
} from '../../middlewares/auth.middleware';
const router = Router();

router.get('/', [verifyToken, isUserActive], getAllUserHandler);
router.post(
  '/',
  [verifyToken, isUserActive, isRoleAdmin, validate(createUserSchema)],
  createUserHandler
);
router.patch(
  '/:id',
  [verifyToken, isUserActive, isRoleAdmin, validate(updateUserSchema)],
  updateUserHandler
);
router.post(
  '/forgotpassword',
  [validate(forgotPasswordSchema)],
  forgotPasswordHandler
);
router.post(
  '/resetpassword/:id',
  [validate(resetPasswordSchema)],
  resetPasswordHandler
);

export default router;
