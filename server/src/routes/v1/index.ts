import { Router } from 'express';
import auth from './auth.routes';
import user from './user.routes';
import profile from './profile.routes';
import category from './category.routes';
import status from './status.routes';
import parcel from './parcel.routes';

const router = Router();

router.use('/api/v1/auth', auth);
router.use('/api/v1/profile', profile);
router.use('/api/v1/user', user);
router.use('/api/v1/category', category);
router.use('/api/v1/status', status);
router.use('/api/v1/parcel', parcel);

export default router;
