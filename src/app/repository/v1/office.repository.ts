import {includes} from 'lodash';

import {Repository} from '../generic';
import {Office} from '../../models/Office';
import {OfficeItems} from '../../models/OfficeItems';
import {SystemItemIcons} from '../../models/SystemItemIcons';
import {OfficeImages} from '../../models/OfficeImages';
import {OfficePlains} from '../../models/OfficePlains';
import {ReservationOffice} from '../../models/ReservationOffice';
import {Building} from '../../models/Building';
import {SystemPercentages} from '../../models/SystemPercentages';
// import {NotificationsReservation} from '../../models/NotificationsReservation';
import {UsersFavoritesOffices} from '../../models/UsersFavoritesOffices';
// import {Building} from '../../models/Building';
import {OfficeArrivalsDirection} from '../../models/OfficeArrivalsDirection';
// import {Users} from '../../models/Users';
// import {UserToken} from '../../models/UserToken';
import {ConstantsManager} from '../../constants/constantsManager';
import {PushNotification} from '../../../utils/PushNotification';
import MailerService from '../../../utils/MailerService';
import KpmgMailer from '../../../utils/KpmgMailer';
// others repositories
import {CheckInRepository} from '../../repository/v1/checkIn.repository';
import {CheckOutRepository} from '../../repository/v1/checkOut.repository';
import {UserFavoriteOfficeRepository} from '../../repository/v1/userFavoriteOffice.repository';
// import {FloorBuilding} from '../../models/FloorBuilding';

import {UsersRepository} from './users.repository';
import {BuildingRepository} from './building.repository';
import {OfficeTypeRepository} from './officeType.repository';
import {FloorBuildingRepository} from './floorBuilding.repository';
import {UserTokenRepository} from './userToken.repository';
import {NotificationReservationRepository} from './notificationReservation.repository';

const {Op, QueryTypes, Sequelize} = require('sequelize');
const moment = require('moment');
const ics = require('ics');
const {writeFileSync} = require('fs');

// export
const axios = require('axios');
export class OfficeRepository extends Repository {
  private userRepository: UsersRepository = new UsersRepository();
  private pushNotification: PushNotification = new PushNotification();
  private mailer: MailerService = new MailerService();
  private kpmgMailer: KpmgMailer = new KpmgMailer();
  private buildingRepository: BuildingRepository = new BuildingRepository();
  private floorBuildingRepository: FloorBuildingRepository = new FloorBuildingRepository();
  private userTokenRepository: UserTokenRepository = new UserTokenRepository();
  private notificationReservationRepository: NotificationReservationRepository = new NotificationReservationRepository();
  private officeTypeRepository: OfficeTypeRepository = new OfficeTypeRepository();
  private constantsManager: ConstantsManager = new ConstantsManager();
  private checkInRepository = new CheckInRepository();
  private checkOutRepository = new CheckOutRepository();
  private userFavoriteOfficeRepository = new UserFavoriteOfficeRepository();

  getListOfOfficeByFloor = async (
    date: Date,
    startTime: string,
    endTime: string,
    cityId: number,
    buildingId: number,
    officeTypeId: number,
    floorBuildingId: number,
    limit: number,
    offset: number,
    uid: string
  ) => {
    const officesAvailable = [];
    const officesNotAvailable = [];
    let allOffices = [];
    this.setModel(Office);
    const offices = await this.all({
      where: {
        status: 'active',
        cityId,
        buildingId,
        officeTypeId,
        floorBuildingId
      },
      limit,
      offset,
      include: [
        {
          model: OfficeImages,
          attributes: [
            'id',
            'description',
            'officeId',
            'status',
            'createdAt',
            ['image', 'image']
            // [
            //   Sequelize.fn(
            //     'CONCAT',
            //     // eslint-disable-next-line no-process-env
            //     this.constantsManager.getUrlOfficeImages(),
            //     Sequelize.col('image')
            //   ),
            //   'image'
            // ]
          ]
        }
      ]
    });
    for (const office of offices) {
      if (uid !== '' && uid !== null && uid !== undefined)
        office.dataValues.isFavorite = await this.userFavoriteOfficeRepository.isFavoriteOfficeOfUser(
          uid,
          office.get('id')
        );

      const isAvailable = await this.isAvailableOffice(
        date,
        startTime,
        endTime,
        office.get('id'),
        officeTypeId
      );
      if (isAvailable.available === true) {
        office.dataValues.isAvailable = true;
        office.dataValues.reservations = [];
        officesAvailable.push(office);
      } else {
        office.dataValues.isAvailable = false;
        office.dataValues.reservations = isAvailable.data;
        officesNotAvailable.push(office);
      }
    }
    allOffices = officesAvailable.concat(officesNotAvailable);
    return allOffices;
  };

  getOfficeFavoriteInfo = async (id: number) => {
    this.setModel(Office);
    const officeInfo = await this.one({
      where: {
        id,
        status: 'active'
      },
      include: [
        {
          model: OfficeImages,
          attributes: [
            'id',
            ['description', 'description'],
            ['officeId', 'officeId'],
            ['status', 'status'],
            ['createdAt', 'createdAt'],
            ['image', 'image']
            // [
            //   Sequelize.fn(
            //     'CONCAT',
            //     // eslint-disable-next-line no-process-env
            //     this.constantsManager.getUrlOfficeImages(),
            //     Sequelize.col('image')
            //   ),
            //   'image'
            // ]
          ]
        }
      ]
    });
    officeInfo.dataValues.buildingName = await this.buildingRepository.getBuilingNameById(
      officeInfo.dataValues.buildingId
    );
    officeInfo.dataValues.floorName = await this.floorBuildingRepository.getFloorBuildingNameById(
      officeInfo.dataValues.floorBuildingId
    );
    return officeInfo;
  };

  getFavoritesOfficesOfUser = async (
    uid: string,
    limit: number,
    offset: number
  ) => {
    this.setModel(UsersFavoritesOffices);
    const favoritesOffices = await this.all({
      attributes: ['officeId'],
      where: {
        status: 'active',
        uid
      },
      limit,
      offset
    });
    const response: object[] = [];
    for (const office of favoritesOffices) {
      // office.dataValues.officeInfo = await this.getOfficeFavoriteInfo(
      //   parseInt(office.dataValues.officeId)
      // );
      const officeInfo: any = await this.getOfficeFavoriteInfo(
        parseInt(office.dataValues.officeId)
      );

      response.push(officeInfo);
    }
    return response;
  };

  isAvailableOffice = async (
    date: any,
    startTime: string,
    endTime: string,
    officeId: number,
    officeTypeId: number,
    excludeReservationId: number = 0
  ) => {
    moment.locale('es');
    let newDate: any = [];
    date.map((res: any) => newDate.push(new Date(res)));
    this.setModel(ReservationOffice);
    const whereClause: Object =
      excludeReservationId === 0
        ? {
            attributes: [
              ['id', 'reservationId'],
              ['date', 'reservationDate'],
              ['startTime', 'reservationStartTime'],
              ['endTime', 'reservationEndTime']
            ],
            where: {
              officeId,
              date: {
                [Op.or]: newDate
              },
              status: 'active'
            }
          }
        : {
            attributes: [
              ['id', 'reservationId'],
              ['date', 'reservationDate'],
              ['startTime', 'reservationStartTime'],
              ['endTime', 'reservationEndTime']
            ],
            where: {
              officeId,
              date: {
                [Op.or]: newDate
              },
              status: 'active',
              id: {
                [Op.ne]: excludeReservationId
              }
            }
          };
    const reservations = await this.all(whereClause);
    this.setModel(Office);
    if (reservations.length === 0)
      return {
        available: true,
        data: {}
      };

    for (const reservation of reservations) {
      const reservationStartTime: number = this.timeToDecimal(
        reservation.dataValues.reservationStartTime
      );
      if (officeTypeId === 4) {
        reservation.dataValues.reservationEndTime = moment(
          `${reservation.dataValues.reservationDate} ${reservation.dataValues.reservationEndTime}`
        )
          .add(30, 'minutes')
          .format('hh:mm');
      }
      const reservationEndTime: number = this.timeToDecimal(
        reservation.dataValues.reservationEndTime
      );
      const newStartTime: number = this.timeToDecimal(startTime);
      const newEndTime: number = this.timeToDecimal(endTime);
      if (
        (newStartTime >= reservationStartTime &&
          newStartTime < reservationEndTime) ||
        (newEndTime > reservationStartTime &&
          newEndTime <= reservationEndTime) ||
        (newStartTime < reservationStartTime && newEndTime > reservationEndTime)
      ) {
        // const infoReservation = (
        //   await this.getInfoAboutReservation(reservation.dataValues.id)
        // ).dataValues;
        return {
          available: false,
          data: reservations
        };
      }
    }
    return {
      available: true,
      data: {}
    };
  };

  getImagesFromOffice = async (officeId: number) => {
    this.setModel(OfficeImages);
    const officeImages = await this.all({
      where: {
        officeId,
        status: 'active'
      }
    });
    this.setModel(Office);
    return officeImages;
  };

  timeToDecimal = (time: any) => {
    const arr: any[] = time.split(':');
    const dec: any = (parseInt(arr[1], 10) / 6) * 10;
    return parseFloat(`${parseInt(arr[0], 10)}.${dec < 10 ? '0' : ''}${dec}`);
  };

  getOfficeInfo = async (id: number) => {
    this.setModel(Office);
    const officeInfo = await this.one({
      where: {
        id,
        status: 'active'
      },
      include: [
        {
          model: OfficeImages,
          attributes: [
            'id',
            'description',
            'officeId',
            'status',
            'createdAt',
            ['image', 'image']
            // [
            //   Sequelize.fn(
            //     'CONCAT',
            //     this.constantsManager.getUrlOfficeImages(),
            //     Sequelize.col('officeImages.image')
            //   ),
            //   'image'
            // ]
          ]
        },
        {
          model: OfficeItems,
          where: {
            status: 'active'
          },
          include: [
            {
              model: SystemItemIcons,
              where: {
                status: 'active'
              },
              attributes: [['png', 'imgPng']]
            }
          ]
        },
        {
          model: OfficePlains,
          attributes: [
            'id',
            'description',
            'officeId',
            'status',
            'createdAt',
            ['image', 'image']
            // [
            //   Sequelize.fn(
            //     'CONCAT',
            //     // eslint-disable-next-line no-process-env
            //     this.constantsManager.getUrlOfficePlains(),
            //     Sequelize.col('officePlains.image')
            //   ),
            //   'image'
            // ]
          ]
        },
        OfficeArrivalsDirection
      ]
    });

    if (officeInfo !== null) {
      officeInfo.dataValues.buildingInfo = await this.buildingRepository.getInfoBuildingAndYourCity(
        officeInfo.dataValues.buildingId
      );
      officeInfo.dataValues.officeTypeInfo = await this.officeTypeRepository.getOfficeTypeInfo(
        officeInfo.dataValues.officeTypeId
      );
      officeInfo.dataValues.floorBuildingInfo = await this.floorBuildingRepository.getIinfoFloorById(
        officeInfo.dataValues.floorBuildingId
      );
      return officeInfo.dataValues;
    } else {
      return officeInfo;
      // return null;
    }
  };

  addOfficeToFavorites = async (officeId: number, uid: string) => {
    this.setModel(UsersFavoritesOffices);

    // remove from list
    const office = await this.officeBelongToUserFavoritesList(officeId, uid);
    if (office !== null) {
      const id: number = office.getDataValue('id');
      await this.destroy({id});
      return {success: true, message: 'Eliminado de la lista de favoritos'};
    }

    await this.create({
      uid,
      officeId,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return {success: true, message: 'Agregado a la lista de favoritos'};
  };

  officeBelongToUserFavoritesList = async (officeId: number, uid: string) => {
    this.setModel(UsersFavoritesOffices);
    const belongToList = await this.one({
      where: {
        uid,
        officeId,
        status: 'active'
      }
    });
    return belongToList;
  };

  existsOffice = async (officeId: number) => {
    const office = await this.all({
      where: {
        id: officeId,
        status: 'active'
      }
    });
    return office.length !== 0;
  };

  getOfficeById = async (officeId: number) => {
    const office = await this.all({
      where: {
        id: officeId,
        status: 'active'
      }
    });
    return office;
  };

  reservationOffice = async (
    date: any,
    startTime: string,
    endTime: string,
    uid: string,
    leadReservationUid: string,
    officeId: number
  ) => {
    let infoReservation: any = {};
    console.log('resevation hola mundo');
    for (const items in date) {
      this.setModel(ReservationOffice);
      let itemDate = date[items];
      await this.create({
        date: itemDate,
        startTime,
        endTime,
        uid,
        leadReservationUid,
        officeId
      });
      const lastReservation = await this.one({
        where: {
          date: new Date(itemDate),
          startTime,
          endTime,
          uid,
          leadReservationUid,
          officeId
        },
        order: [['createdAt', 'DESC']]
      });

      infoReservation = await this.getInfoAboutReservation(
        lastReservation.dataValues.id
      );

      const title = 'KPMG - Reserva de espacio';
      let start = `${moment(`${itemDate}`).format('YYYY-M-D-H-m').split('-')}`;

      ics.createEvent(
        {
          title: title,
          description: title,
          busyStatus: 'FREE',
          start: start.split(','),
          duration: {minutes: 50}
        },
        (error: any, value: any) => {
          if (error) {
            console.log(error);
          }

          writeFileSync(
            `./public/reservas/${lastReservation.dataValues.id}.ics`,
            value
          );

          //const urlEVT = writeFileSync(`./public/reservas/prueba.ics`, value)
        }
      );
      await this.sendCreateReservations(infoReservation.dataValues);
      this.setModel(Office);
    }

    return infoReservation;
  };

  sendCreateReservations = async (infoReservation: any) => {
    moment.locale('es');
    const title = 'KPMG - Reserva de espacio';
    const messageCreate = 'Reserva creada';
    const messageLead = 'Lider de reserva';
    const platform = 'a';
    const newDate = new Date();
    const todayDate = `${this.getTodayDate(newDate)} ${this.getTodayHour(
      newDate
    )}`;
    const anio = moment(newDate).format('YYYY');
    const time = `${moment(
      `${infoReservation.date} ${infoReservation.startTime}`
    ).format('MMMM D, YYYY')} ${moment(
      `${infoReservation.date} ${infoReservation.startTime}`
    ).format('hh:mm A')}-${moment(
      `${infoReservation.date} ${infoReservation.endTime}`
    ).format('hh:mm A')}`;

    const userUid = await this.userTokenRepository.getUserToken(
      infoReservation.uid
    );
    if (userUid) {
      await this.pushNotification.sendPush(
        userUid.dataValues.pushToken,
        platform,
        title,
        messageCreate,
        {}
      );
      await this.notificationReservationRepository.createNewNotification(
        infoReservation.uid,
        messageCreate,
        infoReservation.id,
        todayDate,
        'create'
      );
    }

    const config = {};
    const object = {
      title: title,
      message: messageCreate,
      numberReservation: infoReservation.id,
      fullName: infoReservation.userInfo.fullName,
      userEmail: infoReservation.userInfo.email,
      anio: anio,
      office: infoReservation.officeInfo.name,
      building: infoReservation.officeInfo.buildingInfo.name,
      officeType: infoReservation.officeInfo.officeTypeInfo.name,
      floor: infoReservation.officeInfo.floorBuildingInfo.floor,
      time: time
    };

    await axios
      .post(
        `http://apiemailonekey.co.kworld.kpmg.com:5002/v1/KM/reservation`,
        object,
        config
      ) // url to production environment
      .then(function (json: any) {
        return json.data;
      })
      .catch(function (error: any) {
        return error.response;
      });

    if (infoReservation.uid !== infoReservation.leadReservationUid) {
      const userLead = await this.userTokenRepository.getUserToken(
        infoReservation.leadReservationUid
      );
      if (userLead) {
        await this.pushNotification.sendPush(
          userLead.dataValues.pushToken,
          platform,
          title,
          messageLead,
          {}
        );
        await this.notificationReservationRepository.createNewNotification(
          infoReservation.leadReservationUid,
          messageLead,
          infoReservation.id,
          todayDate,
          'create'
        );
      }

      await axios
        .post(
          `http://apiemailonekey.co.kworld.kpmg.com:5002/v1/KM/reservation`,
          object,
          config
        ) // url to production environment
        .then(function (json: any) {
          return json.data;
        })
        .catch(function (error: any) {
          return error.response;
        });
    }

    return userUid;
  };

  listUserReservations = async (
    uid: string,
    limit: number,
    offset: number,
    filterReservation: number = 0,
    filterDate: string
  ) => {
    const reservationNotPassed = [];
    const reservationPassed = [];
    let allReservations = [];
    const dateToday = new Date();
    const todayDate = new Date(this.getTodayDate(dateToday));
    const todayDate2 = this.getTodayDate(dateToday);
    const todayTime = this.getTodayHour(dateToday);
    const filterByDate = new Date(filterDate);
    let initDate = new Date();
    let finDate = new Date();
    // if (filterDate !== '' && filterByDate >= todayDate) {
    //   initDate = todayDate;
    //   finDate = filterByDate;
    // } else if (filterDate !== '' && filterByDate < todayDate) {
    //   initDate = filterByDate;
    //   finDate = todayDate;
    // }
    if (filterDate === '') {
      initDate = todayDate;
      finDate.setDate(todayDate.getDate() + 7);
    } else {
      initDate = filterByDate;
      finDate = filterByDate;
    }
    this.setModel(ReservationOffice);
    let reservations: any;
    if (filterReservation === 0) {
      reservations = await this.all({
        attributes: [
          'id',
          'date',
          'startTime',
          'endTime',
          'status',
          'leadReservationUid',
          'uid',
          'officeId'
        ],
        where: {
          date: {
            [Op.gte]: initDate,
            [Op.lte]: finDate
          },
          [Op.or]: [{leadReservationUid: uid}, {uid}],
          status: 'active'
        },
        limit,
        offset,
        order: [['date', 'ASC']]
      });
    } else {
      reservations = await this.all({
        attributes: [
          'id',
          'date',
          'startTime',
          'endTime',
          'status',
          'leadReservationUid',
          'uid',
          'officeId'
        ],
        where: {
          id: filterReservation,
          status: 'active'
        }
      });
    }
    // add info about user, user reservation lead and office info
    const response: object[] = [];
    this.setModel(Office);
    for (const reservation of reservations) {
      const moreData = await this.getInfoUserReservation(
        reservation.dataValues.id,
        reservation.dataValues.officeId,
        reservation.dataValues.uid,
        reservation.dataValues.leadReservationUid
      );
      reservation.dataValues.checkInIsDone = moreData.checkInIsDone;
      reservation.dataValues.checkOutIsDone = moreData.checkOutIsDone;
      reservation.dataValues.userInfo = moreData.userInfo;
      reservation.dataValues.officeInfo = moreData.officeInfo;
      reservation.dataValues.leadReservationInfo = moreData.leadReservationInfo;

      if (reservation.dataValues.date === todayDate2) {
        const verifyIsAllowedCheck = this.getIsAllowedCheck(
          reservation.dataValues.officeInfo.durationCheckIn,
          reservation.dataValues.officeInfo.durationCheckOut,
          reservation.dataValues.date,
          reservation.dataValues.startTime,
          reservation.dataValues.endTime,
          todayTime
        );
        reservation.dataValues.isAllowedCheckIn =
          verifyIsAllowedCheck.isAllowedCheckIn;
        reservation.dataValues.isAllowedCheckOut =
          verifyIsAllowedCheck.isAllowedCheckOut;
      } else {
        reservation.dataValues.isAllowedCheckIn = false;
        reservation.dataValues.isAllowedCheckOut = false;
      }

      reservation.dataValues.reservePassed = !!(
        todayDate2 > reservation.dataValues.date ||
        (todayDate2 === reservation.dataValues.date &&
          todayTime > reservation.dataValues.endTime)
      );
      if (reservation.dataValues.reservePassed) {
        reservationPassed.push(reservation);
      } else {
        reservationNotPassed.push(reservation);
      }
      // response.push(reservation);
    }
    allReservations = reservationNotPassed.concat(reservationPassed);

    return allReservations;
  };

  getInfoUserReservation = async (
    reservationId: number,
    reservationOfficeId: number,
    reservationUid: string,
    reservationLeadUid: string
  ) => {
    const reservation = {
      checkInIsDone: false,
      checkOutIsDone: false,
      userInfo: {},
      officeInfo: {},
      leadReservationInfo: {}
    };
    // const reservation: object[] = [];
    this.setModel(ReservationOffice);
    reservation.checkInIsDone = await this.checkInRepository.checkInIsDone(
      reservationId,
      reservationOfficeId
    );
    reservation.checkOutIsDone = await this.checkOutRepository.checkOutIsDone(
      reservationId,
      reservationOfficeId
    );
    this.setModel(Office);
    reservation.userInfo = await this.userRepository.getUserInfo(
      reservationUid
    );
    const officeInfo = await this.getOfficesInfo(reservationOfficeId);
    reservation.officeInfo = officeInfo;
    reservation.leadReservationInfo = await this.userRepository.getUserInfo(
      reservationLeadUid
    );
    return reservation;
  };

  getOfficeDataById = async (id: number) => {
    this.setModel(Office);
    const officeInfo = await this.one({
      attributes: ['name', 'maxCapacity'],
      where: {
        id,
        status: 'active'
      }
    });

    return officeInfo;
  };

  getOfficesInfo = async (id: number) => {
    this.setModel(Office);
    const officeInfo = await this.one({
      where: {
        id,
        status: 'active'
      },
      include: [
        {
          model: OfficeImages,
          attributes: [
            ['id', 'imageId'],
            ['image', 'imgOffice']
            // [
            //   Sequelize.fn(
            //     'CONCAT',
            //     this.constantsManager.getUrlOfficeImages(),
            //     Sequelize.col('officeImages.image')
            //   ),
            //   'imgOffice'
            // ]
          ]
        },
        {
          model: OfficeItems,
          attributes: [
            ['id', 'officeItemId'],
            ['name', 'officeItemName'],
            ['image', 'imgItem']
          ],
          include: [
            {
              model: SystemItemIcons,
              attributes: [['png', 'imgPng']]
            }
          ]
        },
        {
          model: OfficePlains,
          attributes: [
            ['id', 'officePlainId'],
            ['image', 'imgPlain']
            // [
            //   Sequelize.fn(
            //     'CONCAT',
            //     // eslint-disable-next-line no-process-env
            //     this.constantsManager.getUrlOfficePlains(),
            //     Sequelize.col('officePlains.image')
            //   ),
            //   'imgPlain'
            // ]
          ]
        },
        {
          model: OfficeArrivalsDirection,
          attributes: [
            ['id', 'arrivalsDirId'],
            ['description', 'arrivalDescription']
          ]
        }
      ]
    });

    if (officeInfo !== null) {
      officeInfo.dataValues.buildingInfo = await this.buildingRepository.getInfoBuildingById(
        officeInfo.dataValues.buildingId
      );
      officeInfo.dataValues.officeTypeInfo = await this.officeTypeRepository.getOfficeTypeById(
        officeInfo.dataValues.officeTypeId
      );
      officeInfo.dataValues.floorBuildingInfo = await this.floorBuildingRepository.getIFloorInfoById(
        officeInfo.dataValues.floorBuildingId
      );
      return officeInfo.dataValues;
    } else {
      return officeInfo;
      // return null;
    }
  };

  exitsAndIsActiveReservation = async (reservationId: number) => {
    this.setModel(ReservationOffice);
    const reservation = await this.one({
      where: {
        id: reservationId,
        status: 'active'
      }
    });
    return reservation !== null;
  };

  getInfoAboutReservation = async (reservationId: number) => {
    this.setModel(ReservationOffice);
    const reservation = await this.one({
      where: {
        id: reservationId
      }
    });
    reservation.dataValues.checkInIsDone = await this.checkInRepository.checkInIsDone(
      reservationId,
      reservation.dataValues.officeId
    );
    reservation.dataValues.checkOutIsDone = await this.checkOutRepository.checkOutIsDone(
      reservationId,
      reservation.dataValues.officeId
    );
    this.setModel(Office);
    reservation.dataValues.userInfo = await this.userRepository.getUserInfo(
      reservation.dataValues.uid
    );
    const officeInfo = await this.getOfficeInfo(
      reservation.dataValues.officeId
    );
    reservation.dataValues.officeInfo = officeInfo;
    reservation.dataValues.leadReservationInfo = await this.userRepository.getUserInfo(
      reservation.dataValues.leadReservationUid
    );
    return reservation;
  };

  cancelReservation = async (reservationId: number) => {
    this.setModel(ReservationOffice);
    const reservation = await this.one({
      where: {
        id: reservationId
      }
    });
    const infoReservation = await this.getInfoAboutReservation(reservationId);
    await this.sendCancelReservations(infoReservation.dataValues);
    await reservation.update({status: 'inactive'});
  };

  sendCancelReservations = async (infoReservation: any) => {
    moment.locale('es');
    const title = 'KPMG - Reserva de espacio';
    const messageCancel = 'Reserva cancelada';
    const platform = 'a';
    const newDate = new Date();
    const todayDate = `${this.getTodayDate(newDate)} ${this.getTodayHour(
      newDate
    )}`;
    const anio = moment(newDate).format('YYYY');
    const time = `${moment(
      `${infoReservation.date} ${infoReservation.startTime}`
    ).format('MMMM D, YYYY')} ${moment(
      `${infoReservation.date} ${infoReservation.startTime}`
    ).format('hh:mm A')}-${moment(
      `${infoReservation.date} ${infoReservation.endTime}`
    ).format('hh:mm A')}`;

    const userUid = await this.userTokenRepository.getUserToken(
      infoReservation.uid
    );
    if (userUid) {
      await this.pushNotification.sendPush(
        userUid.dataValues.pushToken,
        platform,
        title,
        messageCancel,
        {}
      );
      await this.notificationReservationRepository.createNewNotification(
        infoReservation.uid,
        messageCancel,
        infoReservation.id,
        todayDate,
        'cancel'
      );
    }

    const config = {};
    const object = {
      title: title,
      message: messageCancel,
      numberReservation: infoReservation.id,
      fullName: infoReservation.userInfo.fullName,
      userEmail: infoReservation.userInfo.email,
      anio: anio,
      office: infoReservation.officeInfo.name,
      building: infoReservation.officeInfo.buildingInfo.name,
      officeType: infoReservation.officeInfo.officeTypeInfo.name,
      floor: infoReservation.officeInfo.floorBuildingInfo.floor,
      time: time
    };

    await axios
      .post(
        `http://apiemailonekey.co.kworld.kpmg.com:5002/v1/KM/cancel-reservation`,
        object,
        config
      ) // url to production environment
      .then(function (json: any) {
        return json.data;
      })
      .catch(function (error: any) {
        return error.response;
      });

    if (infoReservation.uid !== infoReservation.leadReservationUid) {
      const userLead = await this.userTokenRepository.getUserToken(
        infoReservation.leadReservationUid
      );
      if (userLead) {
        await this.pushNotification.sendPush(
          userLead.dataValues.pushToken,
          platform,
          title,
          messageCancel,
          {}
        );
        await this.notificationReservationRepository.createNewNotification(
          infoReservation.leadReservationUid,
          messageCancel,
          infoReservation.id,
          todayDate,
          'cancel'
        );
      }

      await axios
        .post(
          `http://apiemailonekey.co.kworld.kpmg.com:5002/v1/KM/cancel-reservation`,
          object,
          config
        ) // url to production environment
        .then(function (json: any) {
          return json.data;
        })
        .catch(function (error: any) {
          return error.response;
        });
    }
    return userUid;
  };

  updateReservation = async (
    reservationId: number,
    date: Date,
    startTime: string,
    endTime: string,
    leadReservationUid: string,
    officeId: number
  ) => {
    this.setModel(ReservationOffice);
    const reservation = await this.one({
      where: {
        id: reservationId
      }
    });
    await reservation.update({
      date,
      startTime,
      endTime,
      leadReservationUid,
      officeId
    });
    return {success: true, message: 'Ok'};
  };

  checkQrOffice = async (officeId: number, code: string) => {
    const office = await this.one({
      where: {
        id: officeId,
        qrCode: code,
        status: 'active'
      }
    });
    return office !== null;
  };

  verifyReservationTime = async (
    date: any,
    startTime: string,
    endTime: string,
    uid: string
  ) => {
    let newDate: any = [];
    date.map((res: any) => newDate.push(new Date(res)));
    console.log('datess', date, newDate);
    this.setModel(ReservationOffice);
    const whereClause: Object = {
      attributes: [
        ['id', 'reservationId'],
        ['date', 'reservationDate'],
        ['startTime', 'reservationStartTime'],
        ['endTime', 'reservationEndTime']
      ],
      where: {
        date: {
          [Op.or]: newDate
        },
        [Op.or]: [{uid}, {leadReservationUid: uid}],
        status: 'active'
      }
    };
    const reservations = await this.all(whereClause);

    this.setModel(Office);
    if (reservations.length === 0) {
      return {
        available: true,
        data: {}
      };
    }

    for (const reservation of reservations) {
      const reservationStartTime: number = this.timeToDecimal(
        reservation.dataValues.reservationStartTime
      );
      const reservationEndTime: number = this.timeToDecimal(
        reservation.dataValues.reservationEndTime
      );
      const newStartTime: number = this.timeToDecimal(startTime);
      const newEndTime: number = this.timeToDecimal(endTime);

      if (
        (newStartTime >= reservationStartTime &&
          newStartTime < reservationEndTime) ||
        (newEndTime > reservationStartTime &&
          newEndTime <= reservationEndTime) ||
        (newStartTime < reservationStartTime && newEndTime > reservationEndTime)
      ) {
        return {
          available: false,
          data: reservation
        };
      }
    }
    return {
      available: true,
      data: {}
    };
  };

  verifyReservationDays = async (date: any, officeId: number, uid: string) => {
    moment.locale('es');
    const todayDate = moment(new Date()).format('YYYY-MM-DD');
    const arrayBefore = await this.getDatesArrayAddOrSubs(
      new Date(moment(date[0]).add(-3, 'day').format('YYYY-MM-DD'))
    );
    const arrayAfter = await this.getDatesArrayAddOrSubs(
      new Date(moment(date[0]).add(1, 'day').format('YYYY-MM-DD'))
    );

    this.setModel(ReservationOffice);
    let countBefore = 0;
    let statusWhere = 'active';
    for (const dateObject of arrayBefore) {
      dateObject < todayDate
        ? (statusWhere = 'used')
        : (statusWhere = 'active');
      const whereClause: Object = {
        attributes: [['id', 'reservationId']],
        where: {
          date: {
            [Op.eq]: new Date(dateObject)
          },
          [Op.or]: [{uid}, {leadReservationUid: uid}],
          officeId,
          status: statusWhere
        }
      };
      const reservations = await this.all(whereClause);
      if (reservations.length !== 0) {
        countBefore += 1;
      }
    }
    let countAfter = 0;
    for (const dateObject2 of arrayAfter) {
      const whereClause2: Object = {
        attributes: [['id', 'reservationId']],
        where: {
          date: {
            [Op.eq]: new Date(dateObject2)
          },
          [Op.or]: [{uid}, {leadReservationUid: uid}],
          officeId,
          status: 'active'
        }
      };
      const reservations2 = await this.all(whereClause2);
      if (reservations2.length !== 0) {
        countAfter += 1;
      }
    }
    this.setModel(Office);

    if (countBefore < 3 && countAfter < 3) {
      return true;
    } else {
      return false;
    }
  };

  getDatesArrayAddOrSubs = async (date: Date) => {
    moment.locale('es');
    const arrayDates = [];
    for (let i = 1; i <= 3; i++) {
      await arrayDates.push(moment(date).add(i, 'day').format('YYYY-MM-DD'));
    }

    return arrayDates;
  };

  changeReservationState = async (id: number, status: string) => {
    this.setModel(ReservationOffice);
    await this.update({status}, {id});
    this.setModel(Office);
  };

  verifyReservationsCheckIn = async () => {
    this.setModel(ReservationOffice);
    moment.locale('es');
    const dateToday = new Date();
    const todayDate = moment(dateToday).format('YYYY-MM-DD');
    const todayHour = moment(dateToday).add(15, 'minutes').format('HH:mm'); // today hour + 15 minutes

    const allReservations = await this.all({
      attributes: ['id', 'date', 'startTime', 'endTime', 'status'],
      where: {
        status: 'active',
        date: {[Op.lte]: todayDate}
      }
    });
    this.setModel(Office);

    if (allReservations !== null) {
      for (const reservation of allReservations) {
        if (reservation.dataValues.date === todayDate) {
          if (reservation.dataValues.startTime < todayHour) {
            this.changeReservationState(reservation.dataValues.id, 'expired');
          }
        } else {
          this.changeReservationState(reservation.dataValues.id, 'expired');
        }
      }
    }

    return true;
  };

  verifyPercentageLimit = async (date: any, officeId: number) => {
    const officeData = await this.one({where: {id: officeId}});
    const officeBuildingId = officeData.dataValues.buildingId;
    const officesBuilding = await this.all({
      attributes: ['id'],
      where: {buildingId: officeBuildingId}
    });
    const totalOfficesBuilding = await this.one({
      attributes: [[Sequelize.fn('COUNT', Sequelize.col('id')), 'total']],
      where: {buildingId: officeBuildingId}
    });
    this.setModel(ReservationOffice);
    let count = 0;
    for (const office of officesBuilding) {
      const officeIdentifier = office.dataValues.id;

      const whereClause: Object = {
        attributes: [[Sequelize.fn('COUNT', Sequelize.col('id')), 'total']],
        where: {
          date: {
            [Op.startsWith]: date[0]
          },
          officeId: officeIdentifier,
          status: 'active'
        }
      };
      const reservationCount = await this.one(whereClause);
      if (reservationCount.dataValues.total > 0) {
        count++;
      }
    }
    const totalOffices = totalOfficesBuilding.dataValues.total;
    let percentOccupation = 0;
    if (count * 100 !== 0) {
      percentOccupation = ((count + 1) * 100) / totalOffices;
    }

    this.setModel(Building);
    const buildingData = await this.one({
      attributes: ['id'],
      where: {id: officeBuildingId},
      include: [
        {
          model: SystemPercentages,
          attributes: ['percent']
        }
      ]
    });
    const percentBuilding =
      buildingData.dataValues.systemPercentages.dataValues.percent;
    this.setModel(Office);

    return {exceeded: percentOccupation >= percentBuilding, percentBuilding};
  };

  constructor() {
    super();
    this.setModel(Office);
  }

  getTodayDate(dateToday: Date) {
    const month =
      dateToday.getMonth() + 1 < 10
        ? `0${dateToday.getMonth() + 1}`
        : dateToday.getMonth() + 1;
    const day =
      dateToday.getDate() < 10
        ? `0${dateToday.getDate()}`
        : dateToday.getDate();
    return `${dateToday.getFullYear()}-${month}-${day}`;
  }

  getTodayHour(dateToday: Date) {
    const hour =
      dateToday.getHours() < 10
        ? `0${dateToday.getHours()}`
        : dateToday.getHours();
    const minutes =
      dateToday.getMinutes() < 10
        ? `0${dateToday.getMinutes()}`
        : dateToday.getMinutes();
    return `${hour}:${minutes}`;
  }

  getIsAllowedCheck(
    durationCheckIn: string,
    durationCheckOut: string,
    reservationDate: string,
    startTime: string,
    endTime: string,
    todayTime: string
  ) {
    const checkInNumber = durationCheckIn.split(' ');
    const checkOutNumber = durationCheckOut.split(' ');

    const startReservation = new Date(`${reservationDate} ${startTime}`);
    const endReservation = new Date(`${reservationDate} ${endTime}`);

    startReservation.setMinutes(
      startReservation.getMinutes() + parseInt(checkInNumber[0])
    );
    endReservation.setMinutes(
      startReservation.getMinutes() - parseInt(checkOutNumber[0])
    );

    const maxTimeToCheckIn = this.getTodayHour(startReservation);
    const minTimeToCheckOut = this.getTodayHour(endReservation);

    const isAllowedCheckIn =
      maxTimeToCheckIn >= todayTime && startTime <= todayTime;
    const isAllowedCheckOut =
      endTime >= todayTime && minTimeToCheckOut <= todayTime;

    return {isAllowedCheckIn, isAllowedCheckOut};
  }
}
