import {Router} from 'express';

import {CityController} from '../../app/controllers/v1/city.controller';
import {accessTokenMiddleware} from '../middlewares';

// Call Controllers
const router = Router();
const cityController = new CityController();

// Set Routers
router.post('/', accessTokenMiddleware, cityController.all);
//router.get('/:id', accessTokenMiddleware, cityController.get);
//router.post('/', accessTokenMiddleware, cityController.create);
//router.put('/:id', accessTokenMiddleware, cityController.update);
//router.put('/deactivate/:id', accessTokenMiddleware, cityController.deactivate);
//router.delete('/:id', accessTokenMiddleware, cityController.del);

export default router;
