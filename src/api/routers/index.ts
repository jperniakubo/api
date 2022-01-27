// Library Base
import router, {Request, Response, NextFunction} from 'express';

import config from '../../config';

import ConfigRouter from './config.router';
import OnboardingRouter from './onboarding.router';
import CatRouter from './client/cat.router';
import CityRouter from './city.router';
import BuildingRouter from './building.router';
import OfficeTypeRouter from './officeType.router';
import HelpCenterRouter from './helpCenter.router';
import PhoneServiceNumberRouter from './phoneServiceNumber.router';
import OfficeRouter from './office.router';
import BoAdminRouter from './boAdmin.router';
import CheckInRouter from './checkIn.router';
import CheckOutRouter from './checkout.router';
import UserRouter from './user.router';
import SystemTimeAvailableRouter from './systemTimeAvailable.router';

const apiRouter = router();

// // Routes - Complements
apiRouter.use(`/${config.SHORT_NAME.toLowerCase()}`, ConfigRouter);
apiRouter.use('/onboarding', OnboardingRouter);
apiRouter.use('/cat', CatRouter);
apiRouter.use('/city', CityRouter);
apiRouter.use('/building', BuildingRouter);
apiRouter.use('/officeType', OfficeTypeRouter);
apiRouter.use('/helpCenter', HelpCenterRouter);
apiRouter.use('/phoneServiceNumber', PhoneServiceNumberRouter);
apiRouter.use('/office', OfficeRouter);
apiRouter.use('/boAdmin', BoAdminRouter);
apiRouter.use('/checkIn', CheckInRouter);
apiRouter.use('/checkOut', CheckOutRouter);
apiRouter.use('/user', UserRouter);
apiRouter.use('/systemTimeAvailableRouter', SystemTimeAvailableRouter);

// Exception
apiRouter.all(
  '*',
  (request: Request, response: Response, errorHandler: NextFunction) => {
    errorHandler(new Error('Page not found'));
  }
);

export default apiRouter;
