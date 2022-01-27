import {Repository} from '../generic';
import {City} from '../../models/City';
// export
export class CityRepository extends Repository {
  allActive = async (limit: number, offset: number) => {
    const response = await this.all({
      where: {status: 'active'},
      limit: limit,
      offset: offset
    });
    return response;
  };

  constructor() {
    super();
    this.setModel(City);
  }
}
