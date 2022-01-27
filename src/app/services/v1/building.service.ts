import config from '../../../config';
import {BuildingRepository} from '../../repository/v1/building.repository';
import {IComplements, IBuilding} from '../../../resources/interfaces';
import {generalServiceResponse} from '../../../utils/GeneralHelpers';
// Language
const language = `../../../resources/lang/${config.LANGUAGE}`;
const lang = require(language);

export class BuildingService {
  buildingRepository: BuildingRepository = new BuildingRepository();

  getBuildingsByCity = async (request: IBuilding.FILTERBYCITY) => {
    //const id: number = request.id;
    const data = await this.buildingRepository.getBuildingsByCity(
      request.cityId,
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

  findBuilding = async (request: IComplements.FilterBuilding) => {
    const data = await this.buildingRepository.findBuilding(
      request.cityId,
      request.limit,
      request.offset
    );
    return generalServiceResponse(data, 'Operación exitosa');
  };

  getFloorsByBuilding = async (request: IBuilding.FloorsByBuilding) => {
    if (
      !(await this.buildingRepository.existsAndIsActiveBuilding(
        request.buildingId
      ))
    )
      return generalServiceResponse(
        null,
        'El identificador del edificio no existe o se encuentra inactivo'
      );

    const data = await this.buildingRepository.getFloorsByBuilding(
      request.buildingId
    );
    return generalServiceResponse(data, 'Operación exitosa');
  };
}
