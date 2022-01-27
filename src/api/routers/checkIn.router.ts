import {Router} from 'express';

import {CheckInController} from '../../app/controllers/v1/checkIn.controller';
import {accessTokenMiddleware} from '../middlewares';

// Call Controllers
const router = Router();
const checkInController = new CheckInController();

// set routers
router.post(
  '/makeCheckIn',
  accessTokenMiddleware,
  checkInController.makeCheckIn
);

export default router;
