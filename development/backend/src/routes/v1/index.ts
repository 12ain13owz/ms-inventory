import { Router } from 'express';
import auth from './auth.routes';
import user from './user.routes';
import profile from './profile.routes';
import category from './category.routes';
import status from './status.routes';
import fund from './fund.routes';
import location from './location.routes';
import inventory from './inventory.routes';
import inventoryCheck from './inventory-check.routes';
import log from './log.routes';

const router = Router();

router.use('/api/v1/auth', auth);
router.use('/api/v1/profile', profile);
router.use('/api/v1/user', user);
router.use('/api/v1/category', category);
router.use('/api/v1/status', status);
router.use('/api/v1/fund', fund);
router.use('/api/v1/location', location);
router.use('/api/v1/inventory', inventory);
router.use('/api/v1/inventory-check', inventoryCheck);
router.use('/api/v1/log', log);

export default router;
