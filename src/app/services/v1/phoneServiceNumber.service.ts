import config from '../../../config';
import {PhoneServiceNumberRepository} from '../../repository/v1/phoneServiceNumber.repository';
import {IComplements} from '../../../resources/interfaces';
// Language
const language = `../../../resources/lang/${config.LANGUAGE}`;
const lang = require(language);

export class PhoneServiceNumberService {
  phoneServiceNumberRepository: PhoneServiceNumberRepository = new PhoneServiceNumberRepository();

  getAll = async (request: IComplements.Pagination) => {
    const data = await this.phoneServiceNumberRepository.getAll(
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
}
