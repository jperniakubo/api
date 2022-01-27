import {Request, Response, NextFunction} from 'express';
import {CheckInService} from '../../services/v1/checkIn.service';
import {IComplements} from '../../../resources/interfaces';
import {ComplementResponse} from '../generic';

export class CheckInController {
  private complementResponse = new ComplementResponse();
  private checkInService: CheckInService = new CheckInService();

  makeCheckIn = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const data: IComplements.MakeCheckIn = request.body;
    const content = await this.checkInService.makeCheckIn(data, request.files);
    await this.complementResponse.returnData(response, nextOrError, content);
  };
}
