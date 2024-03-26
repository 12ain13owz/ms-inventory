import { Router } from 'express';
import { isUserActive, verifyToken } from '../../middlewares/auth.middleware';
import {
  createParcelHandler,
  decrementQuantityParcelHandler,
  deleteParcelHandler,
  getAllParcelHandler,
  getParcelByTrackHandler,
  getParcelsByDateHandler,
  incrementQuantityParcelHandler,
  updateParcelHandler,
} from '../../controllers/parcel.controller';
import { validate } from '../../middlewares/validate.middleware';
import {
  createParcelSchema,
  deleteParcelSchema,
  getParcelByTrackSchema,
  getParcelsByDateSchema,
  updateParcelSchema,
  updateQuantityParcelSchema,
} from '../../schemas/parcel.schema';
import { reduceQualityImage, upload } from '../../middlewares/file.middlerware';

const router = Router();

router.get('/', [verifyToken, isUserActive], getAllParcelHandler);
router.get(
  '/date/:dateStart/:dateEnd',
  [validate(getParcelsByDateSchema), verifyToken, isUserActive],
  getParcelsByDateHandler
);
router.get(
  '/track/:track',
  [validate(getParcelByTrackSchema), verifyToken, isUserActive],
  getParcelByTrackHandler
);

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
