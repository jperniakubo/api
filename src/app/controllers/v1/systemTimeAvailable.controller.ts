import {Request, Response, NextFunction} from 'express';

import {SystemTimeAvailableService} from '../../services/v1/systemTimeAvailable.service';
import {IComplements} from '../../../resources/interfaces';
import {ComplementResponse} from '../generic';

export class SystemTimeAvailableController {
  private complementResponse = new ComplementResponse();
  private systemTimeAvailableService = new SystemTimeAvailableService();
  //   'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head' = any> {

  getTime = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const content = await this.systemTimeAvailableService.getTime();
    await this.complementResponse.returnData(response, nextOrError, content);
  };
}
