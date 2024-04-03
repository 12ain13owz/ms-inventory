import { Router } from 'express';
import {
  getProfileHandeler,
  updateProfileHandler,
  updatePasswordHandler,
} from '../../controllers/profile.controller';
import { isUserActive, verifyToken } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import {
  updateProfileSchema,
  updatePasswordSchema,
} from '../../schemas/profile.schema';

const router = Router();

router.get('/', [verifyToken, isUserActive], getProfileHandeler);
router.patch(
  '/',
  [verifyToken, isUserActive, validate(updateProfileSchema)],
  updateProfileHandler
);
router.post(
  '/password',
  [verifyToken, isUserActive, validate(updatePasswordSchema)],
  updatePasswordHandler
);

export default router;
