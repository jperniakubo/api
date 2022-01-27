import {UserToken} from '../../models/UserToken';
import {Repository} from '../generic';

const {Op, QueryTypes, Sequelize} = require('sequelize');
// export
export class UserTokenRepository extends Repository {
  findByUID = async (uid: string) => {
    const response = await this.singleCondition({uid});
    return response;
  };

  findUserByAuthToken = async (authToken: string) => {
    const response = await this.singleCondition({authToken});
    return response;
  };

  getUserToken = async (uid: string) => {
    const userUid = await this.one({
      where: {
        uid,
        pushToken: {[Op.ne]: '0'}
      },
      order: [['id', 'DESC']]
    });

    return userUid;
  };

  constructor() {
    super();
    this.setModel(UserToken);
  }
}
