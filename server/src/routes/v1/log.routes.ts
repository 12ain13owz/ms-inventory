import { Router } from 'express';
import { isUserActive, verifyToken } from '../../middlewares/auth.middleware';
import { getAllLogHandler } from '../../controllers/log.controller';

const router = Router();
router.get('/', [verifyToken, isUserActive], getAllLogHandler);

export default router;
