import {Router} from 'express';

import {UserController} from '../../app/controllers/v1/user.controller';
import {accessTokenMiddleware} from '../middlewares';

// Call Controllers
const router = Router();
const userController = new UserController();
// Set Routers
router.post('/listUsers', accessTokenMiddleware, userController.listUsers);

router.post('/editUser', accessTokenMiddleware, userController.editUser);

export default router;
