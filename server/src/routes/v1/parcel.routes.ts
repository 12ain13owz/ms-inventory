import { Router } from 'express';
import { isUserActive, verifyToken } from '../../middlewares/auth.middleware';
import {
  createParcelHandler,
  decrementQuantityParcelHandler,
  deleteParcelHandler,
  getAllParcelHandler,
  getParcelByIdHandler,
  getParcelByTrackHandler,
  getParcelsByDateHandler,
  incrementQuantityParcelHandler,
  updateParcelHandler,
} from '../../controllers/parcel.controller';
import { validate } from '../../middlewares/validate.middleware';
import {
  createParcelSchema,
  deleteParcelSchema,
  getParcelByIdSchema,
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
  [verifyToken, isUserActive, validate(getParcelsByDateSchema)],
  getParcelsByDateHandler
);
router.get(
  '/track/:track',
  [verifyToken, isUserActive, validate(getParcelByTrackSchema)],
  getParcelByTrackHandler
);
router.get(
  '/id/:id',
  [verifyToken, isUserActive, validate(getParcelByIdSchema)],
  getParcelByIdHandler
);

router.post(
  '/',
  [
    verifyToken,
    isUserActive,
    upload,
    reduceQualityImage,
    validate(createParcelSchema),
  ],
  createParcelHandler
);
router.put(
  '/:id',
  [
    verifyToken,
    isUserActive,
    upload,
    reduceQualityImage,
    validate(updateParcelSchema),
  ],
  updateParcelHandler
);

router.patch(
  '/increment/:id',
  [verifyToken, isUserActive, validate(updateQuantityParcelSchema)],
  incrementQuantityParcelHandler
);

router.patch(
  '/decrement/:id',
  [verifyToken, isUserActive, validate(updateQuantityParcelSchema)],
  decrementQuantityParcelHandler
);

// router.delete(
//   '/:id',
//   [validate(deleteParcelSchema), verifyToken, isUserActive],
//   deleteParcelHandler
// );

export default router;
