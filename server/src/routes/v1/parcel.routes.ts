import { Router } from 'express';
import { isUserActive, verifyToken } from '../../middlewares/auth.middleware';
import {
  createParcelHandler,
  decrementQuantityParcelHandler,
  deleteParcelHandler,
  getAllParcelHandler,
  incrementQuantityParcelHandler,
  updateParcelHandler,
} from '../../controllers/parcel.controller';
import { validate } from '../../middlewares/validate.middleware';
import {
  createParcelSchema,
  deleteParcelSchema,
  updateParcelSchema,
  updateQuantityParcelSchema,
} from '../../schemas/parcel.schema';
import { reduceQualityImage, upload } from '../../middlewares/file.middlerware';

const router = Router();

router.get('/', [verifyToken, isUserActive], getAllParcelHandler);
router.post(
  '/',
  [
    upload,
    reduceQualityImage,
    validate(createParcelSchema),
    verifyToken,
    isUserActive,
  ],
  createParcelHandler
);
router.put(
  '/:id',
  [
    upload,
    reduceQualityImage,
    validate(updateParcelSchema),
    verifyToken,
    isUserActive,
    verifyToken,
  ],
  updateParcelHandler
);

router.patch(
  '/increment/:id',
  [validate(updateQuantityParcelSchema), verifyToken, isUserActive],
  incrementQuantityParcelHandler
);

router.patch(
  '/decrement/:id',
  [validate(updateQuantityParcelSchema), verifyToken, isUserActive],
  decrementQuantityParcelHandler
);

// router.delete(
//   '/:id',
//   [validate(deleteParcelSchema), verifyToken, isUserActive],
//   deleteParcelHandler
// );

export default router;
