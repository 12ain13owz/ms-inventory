import { Router } from 'express';
import { isUserActive, verifyToken } from '../../middlewares/auth.middleware';
import {
  findAllLogController,
  findLogByCodeController,
  findLogByDateController,
  findLogByIdController,
  findLogByTrackController,
  initialLogController,
  searchLogByCodeController,
} from '../../controllers/log.controller';
import { validate } from '../../middlewares/validate.middleware';
import { logSchema } from '../../schemas/log.schema';

const router = Router();

router.get(
  '/search/code',
  [verifyToken, isUserActive, validate(logSchema.search)],
  searchLogByCodeController
);
router.get('/', [verifyToken, isUserActive], findAllLogController);
router.get('/init', [verifyToken, isUserActive], initialLogController);
router.get(
  '/date/:dateStart/:dateEnd',
  [verifyToken, isUserActive, validate(logSchema.findByDate)],
  findLogByDateController
);
router.get(
  '/track/:track',
  [verifyToken, isUserActive, validate(logSchema.findByTrack)],
  findLogByTrackController
);
router.get(
  '/code/:code',
  [verifyToken, isUserActive, validate(logSchema.findByCode)],
  findLogByCodeController
);
router.get(
  '/:id',
  [verifyToken, isUserActive, validate(logSchema.findById)],
  findLogByIdController
);

export default router;
