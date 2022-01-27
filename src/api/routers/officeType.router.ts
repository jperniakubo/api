import {Router} from 'express';

import {OfficeTypeController} from '../../app/controllers/v1/officeType.controller';
import {accessTokenMiddleware} from '../middlewares';

// Call Controllers
const router = Router();
const officeTypeController = new OfficeTypeController();

// Set Routers
router.post('/getAll', accessTokenMiddleware, officeTypeController.all);

export default router;
