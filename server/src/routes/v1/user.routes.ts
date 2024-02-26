import { Router } from 'express';
import {
  getAllUserHandler,
  getUserHandeler,
} from '../../controllers/user.controller';
import { verifyToken } from '../../middlewares/verify.middleware';

const router = Router();

router.get('/:id', [verifyToken], getUserHandeler);
router.get('/users', getAllUserHandler);

export default router;
