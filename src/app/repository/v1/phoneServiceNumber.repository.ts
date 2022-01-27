import {Repository} from '../generic';
import {PhoneServiceNumber} from '../../models/PhoneServiceNumber';
// export
export class PhoneServiceNumberRepository extends Repository {
  getAll = async (limit: number, offset: number) => {
    const response = await this.all({
      where: {status: 'active'},
      limit: limit,
      offset: offset
    });
    return response;
  };

  constructor() {
    super();
    this.setModel(PhoneServiceNumber);
  }
}
