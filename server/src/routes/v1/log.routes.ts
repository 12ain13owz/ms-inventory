import { Router } from 'express';
import { isUserActive, verifyToken } from '../../middlewares/auth.middleware';
import {
  getAllLogHandler,
  getInitialLogHandler,
  getLogByDateHandler,
  getLogByIdHandler,
  getLogByTrackHandler,
} from '../../controllers/log.controller';
import { validate } from '../../middlewares/validate.middleware';
import {
  getLogByDateSchema,
  getLogByIdSchema,
  getLogByTrackSchema,
} from '../../schemas/log.schema';

const router = Router();
router.get('/', [verifyToken, isUserActive], getAllLogHandler);
router.get('/init', [verifyToken, isUserActive], getInitialLogHandler);
router.get(
  '/date/:dateStart/:dateEnd',
  [verifyToken, isUserActive, validate(getLogByDateSchema)],
  getLogByDateHandler
);
router.get(
  '/track/:track',
  [verifyToken, isUserActive, validate(getLogByTrackSchema)],
  getLogByTrackHandler
);

router.get(
  '/:id',
  [verifyToken, isUserActive, validate(getLogByIdSchema)],
  getLogByIdHandler
);

export default router;
