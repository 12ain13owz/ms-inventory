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
  searchInventoryByCodeController,
  searchInventoryController,
  updateInventoryController,
} from '../../controllers/inventory.controller';
import { validate } from '../../middlewares/validate.middleware';
import { inventorySchema } from '../../schemas/inventory.schema';
import { reduceQualityImage, upload } from '../../middlewares/file.middlerware';
import {
  checkCategoryActive,
  checkFundActive,
  checkLocationActive,
  checkStatusActive,
} from '../../middlewares/check-active.middleware';

const router = Router();

router.get(
  '/search',
  [verifyToken, isUserActive, validate(inventorySchema.search)],
  searchInventoryController
);
router.get(
  '/search/code',
  [verifyToken, isUserActive, validate(inventorySchema.search)],
  searchInventoryByCodeController
);
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
    checkCategoryActive,
    checkStatusActive,
    checkFundActive,
    checkLocationActive,
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
    checkCategoryActive,
    checkStatusActive,
    checkFundActive,
    checkLocationActive,
  ],
  updateInventoryController
);

// router.delete(
//   '/:id',
//   [validate(inventorySchema.delete), verifyToken, isUserActive],
//   deleteInventoryController
// );

export default router;
