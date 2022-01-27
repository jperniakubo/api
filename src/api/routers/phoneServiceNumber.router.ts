import {Router} from 'express';

import {PhoneServiceNumberController} from '../../app/controllers/v1/phoneServiceNumber.controller';
import {accessTokenMiddleware} from '../middlewares';

// Call Controllers
const router = Router();
const phoneServiceNumberController = new PhoneServiceNumberController();

// Set Routers
router.post(
  '/getAll',
  accessTokenMiddleware,
  phoneServiceNumberController.getAll
);

export default router;
