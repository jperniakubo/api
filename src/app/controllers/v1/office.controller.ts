import {Request, Response, NextFunction} from 'express';

import {OfficeService} from '../../services/v1/office.service';
import {IComplements} from '../../../resources/interfaces';
import {ComplementResponse} from '../generic';

export class OfficeController {
  private complementResponse = new ComplementResponse();
  private officeService = new OfficeService();
  //   'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head' = any> {
  getListOfOfficeByFloor = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    // Generate Logic
    const filterOffice: IComplements.FilterOfficeByFloor = request.body;
    const content = await this.officeService.getListOfOfficeByFloor(
      filterOffice
    );
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  getOfficeInfo = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const officeId: IComplements.ID = request.body;
    const content = await this.officeService.getOfficeInfo(officeId);
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  getFavoritesOfficesOfUser = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const data: IComplements.UsersFavoritesOffices = request.body;
    const content = await this.officeService.getFavoritesOfficesOfUser(data);
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  addOfficeToFavorites = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const data: IComplements.AddOfficeToFavorites = request.body;
    const content = await this.officeService.addOfficeToFavorites(data);
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  reservationOffice = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const data: IComplements.ReservationOffice = request.body;
    console.log('daaa', data);
    const content = await this.officeService.reservationOffice(data);
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  verifyReservationTime = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const data: IComplements.VerifyReservationTime = request.body;
    const content = await this.officeService.verifyReservationTime(data);
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  verifyReservationsCheckIn = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    // const data: IComplements.VerifyReservationTime = request.body;
    const content = await this.officeService.verifyReservationsCheckIn();
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  listUserReservations = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const data: IComplements.ListUserReservations = request.body;
    const content = await this.officeService.listUserReservations(data);
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  listNotificationReservationByUid = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const data: IComplements.UsersFavoritesOffices = request.body;
    const content = await this.officeService.listNotificationReservationByUid(
      data
    );
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  getReservationInfo = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const data: IComplements.ID = request.body;
    const content: any = await this.officeService.getReservationInfo(data);
    // console.log(content.data);
    // console.log(content.data.dataValues.userInfo);
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  cancelReservation = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const data: IComplements.ID = request.body;
    const content = await this.officeService.cancelReservation(data);
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  updateReservation = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const data: IComplements.UpdateReservation = request.body;
    const content = await this.officeService.updateReservation(data);
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  checkQrOffice = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const data: IComplements.CheckQrOffice = request.body;
    const content = await this.officeService.checkQrOffice(data);
    await this.complementResponse.returnData(response, nextOrError, content);
  };
}
