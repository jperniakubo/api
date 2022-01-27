import {Request, Response, NextFunction} from 'express';

import {HelpCenterService} from '../../services/v1/HelpCenter.service';
import {SupportTicketService} from '../../services/v1/supportTicket.service';
import {IComplements} from '../../../resources/interfaces';
import MailerService from '../../../utils/MailerService';
import KpmgMailer from '../../../utils/KpmgMailer';
import {ComplementResponse} from '../generic';

const moment = require('moment');

// export
const axios = require('axios');

export class HelpCenterController {
  private complementResponse = new ComplementResponse();
  private helpCenterService = new HelpCenterService();
  private supportTicketService = new SupportTicketService();
  mailer: MailerService = new MailerService();
  private kpmgMailer: KpmgMailer = new KpmgMailer();

  getAllQuestions = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    // Generate Logic
    const pagination: IComplements.Pagination = request.body;
    const content = await this.helpCenterService.getAllQuestions(pagination);
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  generateSupportTicket = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    moment.locale('es');
    const supportTicket: IComplements.SupportTicket = request.body;
    const user: any = await this.helpCenterService.verifyAndGetUser(
      supportTicket
    );
    if (!user.status) {
      return await this.complementResponse.returnData(
        response,
        nextOrError,
        user
      );
    }
    // Send Email
    const newDate = new Date();
    const anio = moment(newDate).format('YYYY');

    user.data.message = supportTicket.message;
    await this.supportTicketService.createSupportTicket(supportTicket);

    const config = {};
    const object = {
      userName: user.data.dataValues.fullName,
      email: user.data.dataValues.email,
      message: supportTicket.message,
      anio: anio
    };

    await axios
      .post(
        `http://apiemailonekey.co.kworld.kpmg.com:5002/v1/KM/tickets`,
        object,
        config
      ) // url to production environment
      .then(function (json: any) {
        return json.data;
      })
      .catch(function (error: any) {
        return error.response;
      });

    return await this.complementResponse.returnData(
      response,
      nextOrError,
      user
    );
  };
}
