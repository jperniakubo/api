import {Request, Response, NextFunction} from 'express';

import {CityService} from '../../services/v1/city.service';
import {IComplements} from '../../../resources/interfaces';
import {ComplementResponse} from '../generic';

export class CityController {
  private complementResponse = new ComplementResponse();
  private cityService = new CityService();
  //   'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head' = any> {
  all = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    // Generate Logic
    const pagination: IComplements.Pagination = request.body;
    const content = await this.cityService.all(pagination);
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  /*get = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    // Generate Logic
    // eslint-disable-next-line radix
    const id: IComplements.ID = {id: parseInt(request.params.id)};
    const content = await this.catService.index(id);
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  del = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    // Generate Logic
    // eslint-disable-next-line radix
    const id: IComplements.ID = {id: parseInt(request.params.id)};
    const content = await this.catService.remove(id);
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  create = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    // Generate Logic
    const data: IComplements.CRUD = request.body;
    const content = await this.catService.create(data);
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  update = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    // Generate Logic
    // eslint-disable-next-line radix
    const id: IComplements.ID = {id: parseInt(request.params.id)};
    const data: IComplements.CRUD = request.body;
    const content = await this.catService.update(id, data);
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  deactivate = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const id: IComplements.ID = request.params;
    const content = await this.catService.deactivate(id);
    await this.complementResponse.returnData(response, nextOrError, content);
  }; */
}
