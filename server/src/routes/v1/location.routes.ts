import { Router } from 'express';
import { validate } from '../../middlewares/validate.middleware';
import {
  isRoleAdmin,
  isUserActive,
  verifyToken,
} from '../../middlewares/auth.middleware';
import {
  createLocationController,
  deleteLocationController,
  findAllLocationController,
  updateLocationController,
} from '../../controllers/location.controller';
import { locationSchema } from '../../schemas/location.schema';

const router = Router();

router.get('/', [verifyToken, isUserActive], findAllLocationController);
router.post(
  '/',
  [verifyToken, isUserActive, isRoleAdmin, validate(locationSchema.create)],
  createLocationController
);
router.put(
  '/:id',
  [verifyToken, isUserActive, isRoleAdmin, validate(locationSchema.update)],
  updateLocationController
);
router.delete(
  '/:id',
  [verifyToken, isUserActive, isRoleAdmin, validate(locationSchema.delete)],
  deleteLocationController
);

export default router;
