import { Router } from 'express';
import auth from './auth.routes';
import user from './user.routes';

const router = Router();

router.use('/api/v1/auth', auth);
router.use('/api/v1/user', user);

export default router;
