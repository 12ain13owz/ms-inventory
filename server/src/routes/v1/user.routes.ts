import { Router } from 'express';
import { getAllUserHandler } from '../../controllers/user.controller';

const router = Router();

router.get('/users', getAllUserHandler);

export default router;
