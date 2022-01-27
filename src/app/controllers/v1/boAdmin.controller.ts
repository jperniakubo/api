import {Request, Response, NextFunction} from 'express';

import {BoAdminService} from '../../services/v1/boAdmin.service';
import {IComplements} from '../../../resources/interfaces';
import {ComplementResponse} from '../generic';
import {UploadAnyFiles} from '../../../utils/UploadFiles';
const Path = require('path');

export class BoAdminController {
  private complementResponse = new ComplementResponse();
  private boAdminService = new BoAdminService();
  //   'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head' = any> {
  loginAdmin = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    // Generate Logic
    const data: IComplements.BoAdminLogin = request.body;
    const content = await this.boAdminService.loginAdmin(data);
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  listAdmins = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const data: IComplements.ListBoAdmins = request.body;
    const content = await this.boAdminService.listAdmins(data);
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  searchAdmins = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const data: IComplements.SearchRecords = request.body;
    const content = await this.boAdminService.searchAdmins(data);
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  createAdmin = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const data: IComplements.CreateAdmin = request.body;
    // Upload profile picture
    /*let avatar: any = request.files.avatar;
    avatar.name = Date.now() + Path.extname(avatar.name);
    avatar.mv('./uploads/boAdminImages/' + avatar.name); */

    const content = await this.boAdminService.createAdmin(data, request.files);
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  changeAdminState = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const data: IComplements.AdminState = request.body;
    const content = await this.boAdminService.changeAdminState(data);
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  updateAdmin = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const data: IComplements.UpdateAdmin = request.body;
    const content = await this.boAdminService.updateAdmin(data, request.files);
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  getAdminInfoById = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const data: IComplements.ID = request.body;
    const content = await this.boAdminService.getAdminInfoById(data);
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  boListUsers = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const data: IComplements.BoListUsers = request.body;
    const content = await this.boAdminService.boListUsers(data);
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  getBroadReportAboutUser = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const data: IComplements.UserUID = request.body;
    const content = await this.boAdminService.getBroadReportAboutUser(data);
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  updateUserState = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const data: IComplements.UserState = request.body;
    const content = await this.boAdminService.updateUserState(data);
    await this.complementResponse.returnData(response, nextOrError, content);
  };
}
