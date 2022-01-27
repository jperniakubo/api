import {NotificationsReservation} from '../../models/NotificationsReservation';
import {Repository} from '../generic';
import {Office} from '../../models/Office';

import {ReservationOfficeRepository} from './reservationOffice.repository';
import {UsersRepository} from './users.repository';
// import {OfficeRepository} from './office.repository';

const moment = require('moment');
// export
export class NotificationReservationRepository extends Repository {
  private reservationOfficeRepository: ReservationOfficeRepository = new ReservationOfficeRepository();
  private usersRepository: UsersRepository = new UsersRepository();
  // private officeRepository: OfficeRepository = new OfficeRepository();

  createNewNotification = async (
    uid: string,
    message: string,
    reservationId: number,
    todayDate: string,
    type: string
  ) => {
    await this.create({
      uid,
      message,
      reservationId,
      createdAt: todayDate,
      type
    });

    const lastNotification = await this.one({
      where: {
        uid,
        reservationId
      },
      order: [['id', 'DESC']]
    });

    return lastNotification;
  };

  listNotificationReservationByUid = async (
    uid: string,
    limit: number,
    offset: number
  ) => {
    moment.locale('es');
    const notifications = await this.all({
      attributes: [
        ['id', 'notifReservationId'],
        ['message', 'message'],
        ['createdAt', 'notifCreatedAt'],
        'reservationId',
        'type'
      ],
      where: {
        uid
      },
      limit,
      offset,
      order: [['id', 'DESC']]
    });

    for (const notification of notifications) {
      notification.dataValues.notifCreatedAt = moment(
        new Date(notification.dataValues.notifCreatedAt)
      ).format('MMMM D, YYYY hh:mm A');
      const reservation = await this.reservationOfficeRepository.getReservationById(
        notification.dataValues.reservationId
      );
      notification.dataValues.reservation = reservation;

      this.setModel(Office);
      const officeData = await this.one({
        attributes: ['name', 'maxCapacity'],
        where: {
          id: reservation.dataValues.officeId
        }
      });
      notification.dataValues.office = officeData.dataValues;
      this.setModel(NotificationsReservation);

      const userReservation = await this.usersRepository.getUserInfo(
        reservation.dataValues.createdUId
      );
      notification.dataValues.user = userReservation;

      const userLead = await this.usersRepository.getUserInfo(
        reservation.dataValues.leadUId
      );
      notification.dataValues.userLead = userLead;
    }

    return notifications;
  };

  constructor() {
    super();
    this.setModel(NotificationsReservation);
  }
}
