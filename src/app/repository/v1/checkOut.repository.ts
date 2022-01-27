import {Repository} from '../generic';
import {CheckOut} from '../../models/CheckOut';
// Repositories
import {ItemsCheckOutRepository} from '../../repository/v1/itemsCheckout.repository';
import {ImagesCheckOutRepository} from '../../repository/v1/imagesCheckout.repository';
import {ReservationOfficeRepository} from '../../repository/v1/reservationOffice.repository';

export class CheckOutRepository extends Repository {
  private imagesCheckOutRepository = new ImagesCheckOutRepository();
  private itemsCheckOutRepository = new ItemsCheckOutRepository();
  private reservationOfficeRepository = new ReservationOfficeRepository();

  makeCheckOut = async (
    reservationId: number,
    comment: string,
    itemsCheckOut: string,
    officeId: number,
    amountOfPeople: number,
    images: string[]
  ) => {
    // save checkout, images and items
    await this.create({
      comment,
      reservationId,
      officeId,
      amountOfPeople,
      status: 'active'
    });
    const lastInsert = await this.one({
      where: {
        comment,
        reservationId,
        officeId,
        status: 'active'
      },
      order: [['createdAt', 'DESC']]
    });
    // change reservation to 'used' status
    this.reservationOfficeRepository.changeReservationState(
      // lastInsert.get('id'),
      reservationId,
      'used'
    );
    await this.imagesCheckOutRepository.saveImagesCheckOut(
      images,
      lastInsert.get('id')
    );
    if (itemsCheckOut.length === 0) return {success: true};

    await this.itemsCheckOutRepository.saveItemsCheckout(
      itemsCheckOut,
      lastInsert.get('id')
    );
    return {success: true};
  };

  checkOutIsDone = async (reservationId: number, officeId: number) => {
    this.setModel(CheckOut); // no neccesary
    const checkOut = await this.one({
      where: {
        reservationId,
        officeId,
        status: 'active'
      }
    });
    return checkOut !== null;
  };

  constructor() {
    super();
    this.setModel(CheckOut);
  }
}
