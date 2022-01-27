import {Request, Response, NextFunction} from 'express';
import {CheckOutService} from '../../services/v1/checkOut.service';
import {IComplements} from '../../../resources/interfaces';
import {ComplementResponse} from '../generic';

export class CheckOutController {
  private complementResponse = new ComplementResponse();
  private checkOutService: CheckOutService = new CheckOutService();

  makeCheckOut = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const data: IComplements.MakeCheckOut = request.body;
    const content = await this.checkOutService.makeCheckOut(
      data,
      request.files
    );
    await this.complementResponse.returnData(response, nextOrError, content);
  };
}
