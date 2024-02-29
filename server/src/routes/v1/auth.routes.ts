import { Router } from 'express';
import {
  loginHandler,
  logoutHandler,
  refreshTokenHandler,
} from '../../controllers/auth.controller';
import { validate } from '../../middlewares/validate.middleware';
import { LoginUserSchema } from '../../schemas/auth.schema';

const router = Router();

router.post('/login', [validate(LoginUserSchema)], loginHandler);
router.delete('/logout', logoutHandler);
router.post('/refresh', refreshTokenHandler);

export default router;
