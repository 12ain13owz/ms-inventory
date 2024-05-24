import { Router } from 'express';
import auth from './auth.routes';
import user from './user.routes';
import profile from './profile.routes';
import category from './category.routes';
import assetStatus from './asset-status.routes';
import usageStatus from './usage-status.routes';
import inventory from './inventory.routes';
import inventoryCheck from './inventory-check.routes';
import log from './log.routes';

const router = Router();

router.use('/api/v1/auth', auth);
router.use('/api/v1/profile', profile);
router.use('/api/v1/user', user);
router.use('/api/v1/category', category);
router.use('/api/v1/asset-status', assetStatus);
router.use('/api/v1/usage-status', usageStatus);
router.use('/api/v1/inventory', inventory);
router.use('/api/v1/inventory-check', inventoryCheck);
router.use('/api/v1/log', log);

export default router;
