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
  [validate(updateProfileSchema), verifyToken, isUserActive],
  updateProfileHandler
);
router.post(
  '/password',
  [validate(updatePasswordSchema), verifyToken, isUserActive],
  updatePasswordHandler
);

export default router;
