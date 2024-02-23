import { Router } from 'express';
import user from './user.routes';

const router = Router();

router.use('/api/v1', user);
export default router;
