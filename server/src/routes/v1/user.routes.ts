import { Router } from 'express';
import { verifyReceptcha } from '../../middlewares/verify.middleware';
import { loginHandler } from '../../controllers/user.controller';
import { validate } from '../../middlewares/validate.middleware';
import { LoginUserSchema } from '../../schemas/use.sehema';

const router = Router();

router.post(
  '/login',
  [validate(LoginUserSchema), verifyReceptcha],
  loginHandler
);

export default router;
