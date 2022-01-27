import {Router} from 'express';

import {OfficeTypeController} from '../../app/controllers/v1/officeType.controller';
import {accessTokenMiddleware} from '../middlewares';
import {OfficeController} from '../../app/controllers/v1/office.controller';

// Call Controllers
const router = Router();
const officeController = new OfficeController();
// Set Routers
router.post(
  '/getListOfOfficeByFloor',
  accessTokenMiddleware,
  officeController.getListOfOfficeByFloor
);
router.post(
  '/getOfficeInfo',
  accessTokenMiddleware,
  officeController.getOfficeInfo
);

router.post(
  '/getFavoritesOfficesOfUser',
  accessTokenMiddleware,
  officeController.getFavoritesOfficesOfUser
);

router.post(
  '/addOfficeToFavorites',
  accessTokenMiddleware,
  officeController.addOfficeToFavorites
);

router.post(
  '/reservationOffice',
  accessTokenMiddleware,
  officeController.reservationOffice
);

router.post(
  '/verifyReservationTime',
  accessTokenMiddleware,
  officeController.verifyReservationTime
);

router.post(
  '/verifyReservationsCheckIn',
  officeController.verifyReservationsCheckIn
);

router.post(
  '/listUserReservations',
  accessTokenMiddleware,
  officeController.listUserReservations
);

router.post(
  '/listNotificationReservationByUid',
  accessTokenMiddleware,
  officeController.listNotificationReservationByUid
);

router.post(
  '/getReservationInfo',
  accessTokenMiddleware,
  officeController.getReservationInfo
);

router.post(
  '/cancelReservation',
  accessTokenMiddleware,
  officeController.cancelReservation
);

router.post(
  '/updateReservation',
  accessTokenMiddleware,
  officeController.updateReservation
);

router.post(
  '/checkQrOffice',
  accessTokenMiddleware,
  officeController.checkQrOffice
);

export default router;
