import { Router } from 'express';
import {
  loginHandler,
  refreshTokenHandler,
} from '../../controllers/auth.controller';
import { validate } from '../../middlewares/validate.middleware';
import { LoginUserSchema } from '../../schemas/use.sehema';

const router = Router();

router.post('/login', [validate(LoginUserSchema)], loginHandler);
router.post('/refresh', refreshTokenHandler);

export default router;
