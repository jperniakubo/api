import {Router} from 'express';

import {BoAdminController} from '../../app/controllers/v1/boAdmin.controller';
import {accessTokenMiddleware} from '../middlewares';

// Call Controllers
const router = Router();
const boAdminController = new BoAdminController();

// Set Routers
router.post('/loginAdmin', accessTokenMiddleware, boAdminController.loginAdmin);

router.post('/listAdmins', accessTokenMiddleware, boAdminController.listAdmins);

router.post(
  '/searchAdmins',
  accessTokenMiddleware,
  boAdminController.searchAdmins
);

router.post(
  '/createAdmin',
  accessTokenMiddleware,
  boAdminController.createAdmin
);

router.post(
  '/changeAdminState',
  accessTokenMiddleware,
  boAdminController.changeAdminState
);

router.post(
  '/updateAdmin',
  accessTokenMiddleware,
  boAdminController.updateAdmin
);

router.post(
  '/getAdminInfoById',
  accessTokenMiddleware,
  boAdminController.getAdminInfoById
);

router.post(
  '/boListUsers',
  accessTokenMiddleware,
  boAdminController.boListUsers
);

router.post(
  '/getBroadReportAboutUser',
  accessTokenMiddleware,
  boAdminController.getBroadReportAboutUser
);

router.post(
  '/updateUserState',
  accessTokenMiddleware,
  boAdminController.updateUserState
);

export default router;
