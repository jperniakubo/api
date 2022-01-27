import {Repository} from '../generic';
import {OfficeType} from '../../models/OfficeType';
import {ConstantsManager} from '../../constants/constantsManager';
import {Office} from '../../models/Office';

import {PositionsRepository} from './positions.repository';
import {PositionsPerOfficeTypeRepository} from './positionsPerOfficeType.repository';

const {Op} = require('sequelize');

// export
export class OfficeTypeRepository extends Repository {
  private positionsRepository: PositionsRepository = new PositionsRepository();
  private positionsPerOfficeTypeRepository: PositionsPerOfficeTypeRepository = new PositionsPerOfficeTypeRepository();

  getAll = async (limit: number, offset: number, position: string) => {
    const positionData = await this.positionsRepository.getPositionByName(
      position
    );
    const positionPerOffTypeData = await this.positionsPerOfficeTypeRepository.getPositionPerOffTypeByPositionId(
      positionData.dataValues.id
    );
    const arrayOfficesTypeId = [];
    for (const positionPerOffic of positionPerOffTypeData) {
      arrayOfficesTypeId.push({id: positionPerOffic.dataValues.officeTypeId});
    }
    const whereClause: Object = {
      where: {
        status: 'active',
        [Op.or]: arrayOfficesTypeId
      },
      limit,
      offset
    };
    const response = await this.all(whereClause);
    // const constantsManager = new ConstantsManager().getUrlBuildingImages();
    for (let index = 0; index < response.length; index++) {
      const officeType = response[index].dataValues;
      // officeType.image = String(constantsManager) + officeType.image;
      officeType.image = `${officeType.image}`;
    }
    return response;
  };

  getOfficeTypeInfo = async (officeTypeId: number) => {
    this.setModel(OfficeType);
    const officeTypeInfo = await this.one({
      where: {
        id: officeTypeId,
        status: 'active'
      }
    });
    return officeTypeInfo.dataValues;
  };

  getOfficeTypeById = async (officeTypeId: number) => {
    this.setModel(OfficeType);
    const officeTypeInfo = await this.one({
      attributes: ['id', 'name', 'description', 'image'],
      where: {
        id: officeTypeId,
        status: 'active'
      }
    });
    return officeTypeInfo.dataValues;
  };

  constructor() {
    super();
    this.setModel(OfficeType);
  }
}
