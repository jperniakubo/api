import {Sequelize} from 'sequelize';

import {Repository} from '../generic';
import {SystemTimeAvailable} from '../../models/SystemTimeAvailable';

const {Op} = require('sequelize');

// export
export class SystemTimeAvailableRepository extends Repository {
  getTime = async () => {
    const timeAvailable = await this.one({
      attributes: ['time'],
      where: {id: 1}
    });
    return timeAvailable;
  };

  constructor() {
    super();
    this.setModel(SystemTimeAvailable);
  }
}
