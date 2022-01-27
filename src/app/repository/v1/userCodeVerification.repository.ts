import {UserCodeVerification} from '../../models/UserCodeVerification';
import {Repository} from '../generic';

// export
export class UserCodeVerificationRepository extends Repository {
  getCodeVerification = async (uid: string) => {
    const lastCode = await this.one({
      attributes: ['id'],
      where: {uid}
    });
    const code = Math.floor(Math.random() * (99999999 - 11111111)) + 11111111;

    if (lastCode === null) {
      await this.create({uid, code});
    } else {
      const idCodeVerification = lastCode.dataValues.id;
      await this.update({code}, {id: idCodeVerification});
    }

    return {code, uid};
  };

  verifyCode = async (uid: string, code: string) => {
    const lastCode = await this.one({
      where: {uid, code}
    });

    return lastCode !== null;
  };

  constructor() {
    super();
    this.setModel(UserCodeVerification);
  }
}
