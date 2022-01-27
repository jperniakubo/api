import config from '../../../config';
import {OfficeTypeRepository} from '../../repository/v1/officeType.repository';
import {IComplements} from '../../../resources/interfaces';
// Language
const language = `../../../resources/lang/${config.LANGUAGE}`;
const lang = require(language);

export class OfficeTypeService {
  officeTypeRepository: OfficeTypeRepository = new OfficeTypeRepository();

  getAll = async (request: IComplements.PaginationOfficeType) => {
    //const id: number = request.id;
    const data = await this.officeTypeRepository.getAll(
      request.limit,
      request.offset,
      request.position
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
