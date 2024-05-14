import { Router } from 'express';
import {
  loginHandler,
  logoutHandler,
  refreshTokenHandler,
} from '../../controllers/auth.controller';
import { validate } from '../../middlewares/validate.middleware';
import { LoginUserSchema } from '../../schemas/auth.schema';
import { verifyRecaptcha } from '../../middlewares/auth.middleware';

const router = Router();

router.post(
  '/login',
  [validate(LoginUserSchema), verifyRecaptcha],
  loginHandler
);
router.delete('/logout', logoutHandler);
router.get('/refresh', refreshTokenHandler);

export default router;
