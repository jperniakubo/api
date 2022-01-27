import {Router} from 'express';

import {HelpCenterController} from '../../app/controllers/v1/helpCenter.controller';
import {accessTokenMiddleware} from '../middlewares';

// Call Controllers
const router = Router();
const helpCenterController = new HelpCenterController();

// Set Routers
router.post(
  '/getAllQuestions',
  accessTokenMiddleware,
  helpCenterController.getAllQuestions
);

router.post(
  '/generateSupportTicket',
  accessTokenMiddleware,
  helpCenterController.generateSupportTicket
);

export default router;
