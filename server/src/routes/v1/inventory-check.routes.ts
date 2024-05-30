import { Router } from 'express';
import {
  isRoleAdmin,
  isUserActive,
  verifyToken,
} from '../../middlewares/auth.middleware';
import {
  createInventoryCheckController,
  deleteInventoryCheckController,
  findAllInventoryCheckController,
  findInventoryCheckByIdController,
  findInventoryCheckByYearController,
} from '../../controllers/inventory-check.controller';
import { validate } from '../../middlewares/validate.middleware';
import { inventoryCheckSehema } from '../../schemas/inventory-check.schema';

const router = Router();

router.get('/', [verifyToken, isUserActive], findAllInventoryCheckController);
router.get(
  '/year/:year',
  [verifyToken, isUserActive, validate(inventoryCheckSehema.findByYear)],
  findInventoryCheckByYearController
);
router.get(
  '/id/:id',
  [verifyToken, isUserActive, validate(inventoryCheckSehema.findById)],
  findInventoryCheckByIdController
);
router.post(
  '/',
  [verifyToken, isUserActive, validate(inventoryCheckSehema.create)],
  createInventoryCheckController
);
router.delete(
  '/:id',
  [
    verifyToken,
    isUserActive,
    isRoleAdmin,
    validate(inventoryCheckSehema.delete),
  ],
  deleteInventoryCheckController
);

export default router;
