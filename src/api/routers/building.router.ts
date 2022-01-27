import {Router} from 'express';

import {BuildingController} from '../../app/controllers/v1/building.controller';
import {accessTokenMiddleware} from '../middlewares';

// Call Controllers
const router = Router();
const buildingController = new BuildingController();

// Set Routers
router.post(
  '/getBuildingsByCity',
  accessTokenMiddleware,
  buildingController.getBuildingsByCity
);
/*router.post(
  '/searchBuildingByName',
  accessTokenMiddleware,
  buildingController.searchBuildingByName
);*/

router.post(
  '/findBuilding',
  accessTokenMiddleware,
  buildingController.findBuilding
);

router.post(
  '/getFloorsByBuilding',
  accessTokenMiddleware,
  buildingController.getFloorsByBuilding
);

export default router;
