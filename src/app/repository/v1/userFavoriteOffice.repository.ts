import {Repository} from '../generic';
import {UsersFavoritesOffices} from '../../models/UsersFavoritesOffices';
// export
export class UserFavoriteOfficeRepository extends Repository {
  isFavoriteOfficeOfUser = async (uid: string, officeId: number) => {
    const favoriteOffice = await this.one({
      where: {
        uid: uid,
        officeId: officeId,
        status: 'active'
      }
    });
    return favoriteOffice !== null;
  };

  constructor() {
    super();
    this.setModel(UsersFavoritesOffices);
  }
}
