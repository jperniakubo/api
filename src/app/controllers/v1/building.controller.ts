import {Request, Response, NextFunction} from 'express';

import {BuildingService} from '../../services/v1/building.service';
import {IComplements, IBuilding} from '../../../resources/interfaces';
import {ComplementResponse} from '../generic';

export class BuildingController {
  private complementResponse = new ComplementResponse();
  private buildingService = new BuildingService();
  //   'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head' = any> {
  getBuildingsByCity = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    // Generate Logic
    const dataFilter: IBuilding.FILTERBYCITY = request.body;
    const content = await this.buildingService.getBuildingsByCity(dataFilter);
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  findBuilding = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const dataFilter: IComplements.FilterBuilding = request.body;
    const content = await this.buildingService.findBuilding(dataFilter);
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  getFloorsByBuilding = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const data: IBuilding.FloorsByBuilding = request.body;
    const content = await this.buildingService.getFloorsByBuilding(data);
    await this.complementResponse.returnData(response, nextOrError, content);
  };
}
