import {Router} from 'express';

import {accessTokenMiddleware} from '../middlewares';
import {SystemTimeAvailableController} from '../../app/controllers';

// Call Controllers
const router = Router();
const systemTimeAvailableController = new SystemTimeAvailableController();
// Set Routers

router.get(
  '/getTime',
  accessTokenMiddleware,
  systemTimeAvailableController.getTime
);

export default router;
