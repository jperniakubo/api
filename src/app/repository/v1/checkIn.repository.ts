import {Repository} from '../generic';
import {CheckIn} from '../../models/CheckIn';
// repositories
import {ImagesCheckInRepository} from '../../repository/v1/imagesCheckIn.repository';
import {ItemsCheckInRepository} from '../../repository/v1/itemsCheckIn.repository';

export class CheckInRepository extends Repository {
  private imagesCheckInRepository = new ImagesCheckInRepository();
  private itemsCheckInRepository = new ItemsCheckInRepository();

  constructor() {
    super();
    this.setModel(CheckIn);
  }

  makeCheckIn = async (
    reservationId: number,
    comment: string,
    itemsCheckIn: string,
    officeId: number,
    amountOfPeople: number,
    images: string[]
  ) => {
    // save checkIn, items and images
    await this.create({
      comment: comment,
      reservationId: reservationId,
      officeId: officeId,
      amountOfPeople: amountOfPeople,
      status: 'active'
    });
    const lastInsert = await this.one({
      where: {
        comment: comment,
        reservationId: reservationId,
        officeId: officeId,
        status: 'active'
      },
      order: [['createdAt', 'DESC']]
    });
    await this.imagesCheckInRepository.saveCheckInImages(
      images,
      lastInsert.get('id')
    );
    if (itemsCheckIn.length === 0) return {success: 'true'};

    await this.itemsCheckInRepository.saveItemsCheckIn(
      itemsCheckIn,
      lastInsert.get('id')
    );
    return {success: 'true'};
  };

  checkInIsDone = async (reservationId: number, officeId: number) => {
    const checkIn = await this.one({
      where: {
        reservationId: reservationId,
        officeId: officeId,
        status: 'active'
      }
    });
    return checkIn !== null;
  };
}
