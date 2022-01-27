import {Repository} from '../generic';
import {ReservationOffice} from '../../models/ReservationOffice';

const moment = require('moment');

// export
export class ReservationOfficeRepository extends Repository {
  countReservationsByUser = async (uid: string, flag: string = 'all') => {
    let whereClause: any;
    if (flag === 'all') {
      whereClause = {
        where: {
          uid
        }
      };
    } else {
      whereClause = {
        where: {
          uid,
          status: flag
        }
      };
    }
    const amountOfReservations = await this.all(whereClause);
    return amountOfReservations.length;
  };

  listReservationsFromUser = async (
    uid: string,
    limit: number,
    offset: number,
    buildingId: number,
    officeId: number,
    date: Date | string
  ) => {
    const reservations = await this.all({
      where: {
        leadReservationUid: uid
      },
      order: [['date', 'ASC']]
    });

    return reservations;
  };

  changeReservationState = async (id: number, status: string) => {
    await this.update({status}, {id});
  };

  getReservationById = async (id: number) => {
    const reservationInfo = await this.one({
      attributes: [
        ['date', 'dateReservation'],
        ['startTime', 'startReservation'],
        ['endTime', 'endReservation'],
        ['uid', 'createdUId'],
        ['leadReservationUid', 'leadUId'],
        'officeId',
        'status'
      ],
      where: {
        id
      }
    });
    moment.locale('es');
    reservationInfo.dataValues.dateReservation = moment(
      reservationInfo.dataValues.dateReservation
    )
      .format('MMMM D, YYYY')
      .toUpperCase();

    return reservationInfo;
  };

  constructor() {
    super();
    this.setModel(ReservationOffice);
  }
}
