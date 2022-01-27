import {Repository} from '../generic';
import {HelpCenter} from '../../models/HelpCenter';
import {Users} from '../../models/Users';
// export
export class HelpCenterRepository extends Repository {
  getAllQuestions = async (limit: number, offset: number) => {
    this.setModel(HelpCenter);
    const response = await this.all({
      where: {status: 'active'},
      limit,
      offset
    });
    return response;
  };

  verifyAndGetUser = async (uid: string) => {
    this.setModel(Users);
    const user = await this.one({
      where: {
        uid,
        status: 'active'
      },
      attributes: {exclude: ['password']}
    });
    this.setModel(HelpCenter);
    if (user) {
      return user;
    } else {
      return null;
    }
  };

  constructor() {
    super();
    this.setModel(HelpCenter);
  }
}
