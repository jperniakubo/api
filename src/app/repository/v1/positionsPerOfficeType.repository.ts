import {Sequelize} from 'sequelize';

import {Repository} from '../generic';
import {PositionsPerOfficeType} from '../../models/PositionsPerOfficeType';

const {Op} = require('sequelize');

// export
export class PositionsPerOfficeTypeRepository extends Repository {
  savePositionPerOfficeType = async (
    officeTypeId: number,
    positionId: number
  ) => {
    await this.create({
      officeTypeId,
      positionId,
      status: 'active'
    });
  };

  getPositionPerOffTypeByPositionId = async (positionId: number) => {
    const positions = await this.all({
      attributes: ['id', 'positionId', 'officeTypeId'],
      where: {
        positionId,
        status: 'active'
      }
    });
    return positions;
  };

  getPositionPerOffTypeByOfficeTypeId = async (officeTypeId: number) => {
    const positions = await this.all({
      attributes: ['id', 'positionId', 'officeTypeId'],
      where: {
        officeTypeId,
        status: 'active'
      }
    });
    return positions;
  };

  getPositionsByOfficeTypeId = async (officeTypeId: number) => {
    const positions = await this.all({
      attributes: ['id', 'positionId'],
      where: {
        officeTypeId,
        status: 'active'
      }
    });
    return positions;
  };

  setPositionPerOfficeStatus = async (status: string, id: number) => {
    const update = await this.update({status}, {id});
    return update;
  };

  existPositionsByOfficeTypeId = async (
    officeTypeId: number,
    positionId: number
  ) => {
    const position = await this.one({
      attributes: ['id'],
      where: {
        officeTypeId,
        positionId
      }
    });
    return position !== null;
  };

  getByOfficeTypeAndPosition = async (
    officeTypeId: number,
    positionId: number
  ) => {
    const position = await this.one({
      attributes: ['id'],
      where: {
        officeTypeId,
        positionId
      }
    });
    return position;
  };

  getAllPositionsByOfficeTypeId = async (officeTypeId: number) => {
    const positions = await this.all({
      attributes: ['id'],
      where: {
        officeTypeId
      }
    });
    return positions;
  };

  constructor() {
    super();
    this.setModel(PositionsPerOfficeType);
  }
}
