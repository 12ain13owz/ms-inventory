import { Router } from 'express';
import { isUserActive, verifyToken } from '../../middlewares/auth.middleware';
import {
  createInventoryController,
  deleteInventoryController,
  findAllInventoryController,
  findInventoryByCodeController,
  findInventoryByDateController,
  findInventoryByIdController,
  findInventoryByTrackController,
  initialInventoryController,
  updateInventoryController,
} from '../../controllers/inventory.controller';
import { validate } from '../../middlewares/validate.middleware';
import { inventorySchema } from '../../schemas/inventory.schema';
import { reduceQualityImage, upload } from '../../middlewares/file.middlerware';

const router = Router();

router.get('/', [verifyToken, isUserActive], findAllInventoryController);
router.get('/init', [verifyToken, isUserActive], initialInventoryController);
router.get(
  '/date/:dateStart/:dateEnd',
  [verifyToken, isUserActive, validate(inventorySchema.findByDate)],
  findInventoryByDateController
);
router.get(
  '/track/:track',
  [verifyToken, isUserActive, validate(inventorySchema.findByTrack)],
  findInventoryByTrackController
);
router.get(
  '/id/:id',
  [verifyToken, isUserActive, validate(inventorySchema.findById)],
  findInventoryByIdController
);
router.get(
  '/code/:code',
  [verifyToken, isUserActive, validate(inventorySchema.findByCode)],
  findInventoryByCodeController
);
router.post(
  '/',
  [
    verifyToken,
    isUserActive,
    upload,
    reduceQualityImage,
    validate(inventorySchema.create),
  ],
  createInventoryController
);
router.put(
  '/:id',
  [
    verifyToken,
    isUserActive,
    upload,
    reduceQualityImage,
    validate(inventorySchema.update),
  ],
  updateInventoryController
);

// router.delete(
//   '/:id',
//   [validate(inventorySchema.delete), verifyToken, isUserActive],
//   deleteInventoryController
// );

export default router;
