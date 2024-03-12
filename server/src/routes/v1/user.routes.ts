import { Router } from 'express';
import {
  createUserHandler,
  getAllUserHandler,
  updateUserHandler,
  updateUserPasswordHandler,
} from '../../controllers/user.controller';
import { validate } from '../../middlewares/validate.middleware';
import {
  createUserSchema,
  updateUserPasswordSchema,
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
  [validate(createUserSchema), verifyToken, isUserActive, isRoleAdmin],
  createUserHandler
);
router.patch(
  '/:id',
  [validate(updateUserSchema), verifyToken, isUserActive, isRoleAdmin],
  updateUserHandler
);
router.post(
  '/password/:id',
  [validate(updateUserPasswordSchema), verifyToken, isUserActive, isRoleAdmin],
  updateUserPasswordHandler
);

export default router;
