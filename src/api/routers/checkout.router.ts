import {Router} from 'express';

import {CheckOutController} from '../../app/controllers/v1/checkOut.controller';
import {accessTokenMiddleware} from '../middlewares';

// Call Controllers
const router = Router();
const checkOutController = new CheckOutController();

// set routers
router.post(
  '/makeCheckOut',
  accessTokenMiddleware,
  checkOutController.makeCheckOut
);

export default router;
