import {Sequelize} from 'sequelize';

import {Repository} from '../generic';
import {Positions} from '../../models/Positions';

const {Op} = require('sequelize');

// export
export class PositionsRepository extends Repository {
  getAllPositions = async () => {
    const allPositions = await this.all({
      attributes: ['id', 'name', 'status'],
      where: {
        status: 'active'
      }
    });

    return {allPositions};
  };

  getPositionByName = async (name: string) => {
    const position = await this.one({
      attributes: ['id', 'name', 'status'],
      where: {
        name
      }
    });

    return position;
  };

  getPositionByArrayIds = async (arrayIds: any) => {
    const positions = await this.all({
      attributes: ['id', 'name', 'status'],
      where: {
        [Op.or]: arrayIds
      }
    });

    return positions;
  };

  constructor() {
    super();
    this.setModel(Positions);
  }
}
