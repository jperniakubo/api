import {Request, Response, NextFunction} from 'express';

import {OfficeTypeService} from '../../services/v1/officeType.service';
import {IComplements} from '../../../resources/interfaces';
import {ComplementResponse} from '../generic';

export class OfficeTypeController {
  private complementResponse = new ComplementResponse();
  private officeTypeService = new OfficeTypeService();
  //   'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head' = any> {
  all = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    // Generate Logic
    const pagination: IComplements.PaginationOfficeType = request.body;
    const content = await this.officeTypeService.getAll(pagination);
    await this.complementResponse.returnData(response, nextOrError, content);
  };
}
