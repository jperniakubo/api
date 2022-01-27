import {Request, Response, NextFunction} from 'express';

import {UserService} from '../../services/v1/user.service';
import {IComplements, IBuilding} from '../../../resources/interfaces';
import {ComplementResponse} from '../generic';

export class UserController {
  private complementResponse = new ComplementResponse();
  private userService = new UserService();

  listUsers = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    // Generate Logic
    const data: IComplements.ClassicSearchUser = request.body;
    const content = await this.userService.listUsers(data);
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  editUser = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    // const data: IComplements.EditUser = request.body;
    const data: IComplements.EditUserOnlyImage = request.body;
    // console.log('contenido de request files');
    // console.log(request.files);
    const content = await this.userService.editUser(data, request.files);
    await this.complementResponse.returnData(response, nextOrError, content);
  };
}
