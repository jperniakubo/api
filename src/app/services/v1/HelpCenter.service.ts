import config from '../../../config';
import {HelpCenterRepository} from '../../repository/v1/helpCenter.repository';
import {IComplements} from '../../../resources/interfaces';
import {generalServiceResponse} from '../../../utils/GeneralHelpers';
// Language
const language = `../../../resources/lang/${config.LANGUAGE}`;
const lang = require(language);

export class HelpCenterService {
  helpCenterRepository: HelpCenterRepository = new HelpCenterRepository();

  getAllQuestions = async (request: IComplements.Pagination) => {
    //const id: number = request.id;
    const data = await this.helpCenterRepository.getAllQuestions(
      request.limit,
      request.offset
    );
    // Check if Exist
    if (typeof data === 'undefined' || !data || data === null) {
      return {
        status: false,
        message: lang.STACK.CRUD.ERROR.EMPTY
      };
    }

    return {
      status: true,
      data,
      message: lang.STACK.CRUD.SUCCESS
    };
  };

  verifyAndGetUser = async (request: IComplements.SupportTicket) => {
    const user = await this.helpCenterRepository.verifyAndGetUser(request.uid);
    if (user === null)
      return generalServiceResponse(null, 'Usuario incorrecto o inactivo');

    return generalServiceResponse(user, 'Correo electrónico enviado');
  };
}
