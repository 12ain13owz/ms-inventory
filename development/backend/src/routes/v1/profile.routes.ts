import { Router } from 'express';
import {
  changePasswordController,
  findProfileController,
  updateProfileController,
} from '../../controllers/profile.controller';
import { isUserActive, verifyToken } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { profileSchema } from '../../schemas/profile.schema';

const router = Router();

router.get('/', [verifyToken, isUserActive], findProfileController);
router.patch(
  '/',
  [verifyToken, isUserActive, validate(profileSchema.update)],
  updateProfileController
);
router.post(
  '/change-password',
  [verifyToken, isUserActive, validate(profileSchema.changePassword)],
  changePasswordController
);

export default router;
