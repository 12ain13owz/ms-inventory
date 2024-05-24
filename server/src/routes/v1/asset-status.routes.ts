import { Router } from 'express';
import { validate } from '../../middlewares/validate.middleware';
import {} from '../../schemas/category.schema';
import {
  isRoleAdmin,
  isUserActive,
  verifyToken,
} from '../../middlewares/auth.middleware';

import {
  createAssetStatusController,
  deleteAssetStatusController,
  findAllAssetsController,
  updateAssetStatusController,
} from '../../controllers/asset-status.controller';
import { assetStatusSchema } from '../../schemas/asset-status.schema';

const router = Router();

router.get('/', [verifyToken, isUserActive], findAllAssetsController);
router.post(
  '/',
  [verifyToken, isUserActive, isRoleAdmin, validate(assetStatusSchema.create)],
  createAssetStatusController
);
router.put(
  '/:id',
  [verifyToken, isUserActive, isRoleAdmin, validate(assetStatusSchema.update)],
  updateAssetStatusController
);
router.delete(
  '/:id',
  [verifyToken, isUserActive, isRoleAdmin, validate(assetStatusSchema.delete)],
  deleteAssetStatusController
);

export default router;
