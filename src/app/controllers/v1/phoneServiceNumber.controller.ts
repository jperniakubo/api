import {Request, Response, NextFunction} from 'express';

import {PhoneServiceNumberService} from '../../services/v1/phoneServiceNumber.service';
import {IComplements} from '../../../resources/interfaces';
import {ComplementResponse} from '../generic';

export class PhoneServiceNumberController {
  private complementResponse = new ComplementResponse();
  private phoneServiceNumberService = new PhoneServiceNumberService();
  //   'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head' = any> {
  getAll = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    // Generate Logic
    const pagination: IComplements.Pagination = request.body;
    const content = await this.phoneServiceNumberService.getAll(pagination);
    await this.complementResponse.returnData(response, nextOrError, content);
  };
}
