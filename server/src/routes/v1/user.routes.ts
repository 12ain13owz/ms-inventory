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
  [verifyToken, isUserActive, isRoleAdmin, validate(createUserSchema)],
  createUserHandler
);
router.patch(
  '/:id',
  [verifyToken, isUserActive, isRoleAdmin, validate(updateUserSchema)],
  updateUserHandler
);
// router.post(
//   '/password/:id',
//   [validate(updateUserPasswordSchema), verifyToken, isUserActive, isRoleAdmin],
//   updateUserPasswordHandler
// );

export default router;
