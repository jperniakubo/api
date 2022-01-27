import config from '../../../config';
import {SupportTicketRepository} from '../../repository/v1/supportTicket.repository';
import {IComplements} from '../../../resources/interfaces';
import {generalServiceResponse} from '../../../utils/GeneralHelpers';
// Language
const language = `../../../resources/lang/${config.LANGUAGE}`;
const lang = require(language);

export class SupportTicketService {
  supportTicketRepository: SupportTicketRepository = new SupportTicketRepository();

  createSupportTicket = async (request: IComplements.SupportTicket) => {
    const data = await this.supportTicketRepository.createSupportTicket(
      request.message,
      request.uid
    );
    return generalServiceResponse(data, 'Operación exitosa');
  };
}
