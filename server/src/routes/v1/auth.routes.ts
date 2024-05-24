import { Router } from 'express';
import {
  loginController,
  logoutController,
  refreshTokenController,
} from '../../controllers/auth.controller';
import { validate } from '../../middlewares/validate.middleware';
import { authSehema } from '../../schemas/auth.schema';
import { verifyRecaptcha } from '../../middlewares/auth.middleware';

const router = Router();

router.post(
  '/login',
  [validate(authSehema.login), verifyRecaptcha],
  loginController
);
router.delete('/logout', logoutController);
router.get('/refresh', refreshTokenController);

export default router;
