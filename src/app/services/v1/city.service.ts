import config from '../../../config';
import {CityRepository} from '../../repository/v1/city.repository';
import {IComplements} from '../../../resources/interfaces';
// Language
const language = `../../../resources/lang/${config.LANGUAGE}`;
const lang = require(language);

export class CityService {
  cityRepository: CityRepository = new CityRepository();

  all = async (request: IComplements.Pagination) => {
    const data = await this.cityRepository.allActive(
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
  /*
  index = async (request: IComplements.ID) => {
    const id: number = request.id;
    const data = await this.catRepository.singleCondition({id});
    // Check if Exist
    if (typeof data === 'undefined' || !data) {
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

  remove = async (request: IComplements.ID) => {
    const id: number = request.id;
    const data = await this.catRepository.destroy({id});
    return {
      status: true,
      data,
      message: lang.STACK.CRUD.DESTROY
    };
  };

  create = async (request: IComplements.CRUD) => {
    const data = await this.catRepository.create(request);
    if (typeof data === 'undefined' || !data || data === null) {
      return {
        status: false,
        message: lang.STACK.CRUD.ERROR.MAKE
      };
    }
    return {
      status: true,
      data: request,
      message: lang.STACK.CRUD.MAKE
    };
  };

  update = async (key: IComplements.ID, request: IComplements.CRUD) => {
    const id: number = key.id;
    const data = await this.catRepository.update(request, {id});

    if (typeof data === 'undefined' || !data) {
      return {
        status: false,
        message: lang.STACK.CRUD.ERROR.MAKE
      };
    }
    return {
      status: true,
      data: request,
      message: lang.STACK.CRUD.MAKE
    };
  };

  deactivate = async (id: any) => {
    const data = await this.catRepository.deactivate({id});
    if (typeof data === 'undefined' || !data || data === null) {
      return {
        status: false,
        message: lang.STACK.CRUD.ERROR.DEACTIVATE
      };
    }
    return {
      status: true,
      data: request,
      message: lang.STACK.CRUD.DEACTIVATE
    };
  }; */
}
