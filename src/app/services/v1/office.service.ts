import {timestampWithMs} from '@sentry/utils';

import config from '../../../config';
import {OfficeRepository} from '../../repository/v1/office.repository';
import {NotificationReservationRepository} from '../../repository/v1/notificationReservation.repository';
import {UsersRepository} from '../../repository/v1/users.repository';
import {IComplements} from '../../../resources/interfaces';
import {generalServiceResponse} from '../../../utils/GeneralHelpers';
// Language
const language = `../../../resources/lang/${config.LANGUAGE}`;
const lang = require(language);

export class OfficeService {
  officeRepository: OfficeRepository = new OfficeRepository();
  notificationReservationRepository: NotificationReservationRepository = new NotificationReservationRepository();
  userRepository: UsersRepository = new UsersRepository();

  getListOfOfficeByFloor = async (
    request: IComplements.FilterOfficeByFloor
  ) => {
    const data = await this.officeRepository.getListOfOfficeByFloor(
      request.date,
      request.startTime,
      request.endTime,
      request.cityId,
      request.buildingId,
      request.officeTypeId,
      request.floorBuildingId,
      request.limit,
      request.offset,
      request.uid
    );
    return generalServiceResponse(data);
  };

  getOfficeInfo = async (request: IComplements.ID) => {
    const data = await this.officeRepository.getOfficeInfo(request.id);
    return generalServiceResponse(data);
  };

  getFavoritesOfficesOfUser = async (
    request: IComplements.UsersFavoritesOffices
  ) => {
    const data = await this.officeRepository.getFavoritesOfficesOfUser(
      request.uid,
      request.limit,
      request.offset
    );
    return generalServiceResponse(data);
  };

  addOfficeToFavorites = async (request: IComplements.AddOfficeToFavorites) => {
    const user = await this.userRepository.findByUID(request.uid);
    if (user === null)
      return generalServiceResponse(
        null,
        'Idenficicador del usuario es incorrecto o este se encuentra inactivo'
      );

    // if (!(await this.officeRepository.existsOffice(request.officeId)))
    const existOffice = await this.officeRepository.getOfficeById(
      request.officeId
    );
    if (existOffice === null)
      return generalServiceResponse(
        null,
        'El identificador de la oficina es incorrecto'
      );

    const responseAddToFavorites = await this.officeRepository.addOfficeToFavorites(
      request.officeId,
      request.uid
    );
    return responseAddToFavorites.success
      ? generalServiceResponse({success: true}, responseAddToFavorites.message)
      : generalServiceResponse(null, 'Ha ocurrido un error inesperado');
  };

  reservationOffice = async (request: IComplements.ReservationOffice) => {
    console.log('request', request);

    const users = await this.userRepository.existsUser(request.uid);
    if (!users) {
      return generalServiceResponse(
        {code: 401, data: {}},
        'Identificador del usuario es incorrecto'
      );
    }

    if (!this.userRepository.existsUser(request.leadReservationUid)) {
      return generalServiceResponse(
        {code: 401, data: {}},
        'Identificación del líder de la reservación es incorrecto'
      );
    }

    const checkReservationTimeUid = await this.officeRepository.verifyReservationTime(
      request.date,
      request.startTime,
      request.endTime,
      request.uid
    );
    if (
      (!users.typePositionsId && !checkReservationTimeUid.available) ||
      (users.typePositionsId === 2 && !checkReservationTimeUid.available)
    ) {
      return generalServiceResponse(
        {code: 401, data: checkReservationTimeUid.data},
        'Tienes un espacio reservado dentro del rango de tiempo especificado'
      );
    }

    console.log('validar espacio lider');
    const checkReservationTimeLead = await this.officeRepository.verifyReservationTime(
      request.date,
      request.startTime,
      request.endTime,
      request.leadReservationUid
    );
    if (!checkReservationTimeLead.available) {
      return generalServiceResponse(
        {code: 401, data: checkReservationTimeLead.data},
        'El líder que seleccionaste tiene un espacio reservado dentro del rango de tiempo especificado'
      );
    }

    //reservas cercanas
    const checkReservationDaysUid = await this.officeRepository.verifyReservationDays(
      request.date,
      request.officeId,
      request.uid
    );
    if (
      (!users.typePositionsId && !checkReservationDaysUid) ||
      (users.typePositionsId === 2 && !checkReservationDaysUid)
    ) {
      return generalServiceResponse(
        {code: 401, data: {}},
        'Ya tienes tres reservas próximo a la fecha que seleccionaste con el mismo espacio que elegiste'
      );
    }

    const checkReservationDaysLead = await this.officeRepository.verifyReservationDays(
      request.date,
      request.officeId,
      request.leadReservationUid
    );
    if (!checkReservationDaysLead) {
      return generalServiceResponse(
        {code: 401, data: {}},
        'El líder de reserva tiene tres reservas próximas a la fecha que seleccionaste con el espacio que elegiste'
      );
    }

    /// Este codigo me falla en desarrollo falta validar que este funcionando en production por diferencias de tablas de base de datos

    // const checkPercentLimit = await this.officeRepository.verifyPercentageLimit(
    //   request.date,
    //   request.officeId
    // );
    // if (checkPercentLimit.exceeded) {
    //   return generalServiceResponse(
    //     {code: 401, data: {}},
    //     `El porcentaje de ocupación es superado en el edificio, este solo acepta un ${checkPercentLimit.percentBuilding}%.`
    //   );
    // }

    console.log('crear reserva');

    const data = await this.officeRepository.reservationOffice(
      request.date,
      request.startTime,
      request.endTime,
      request.uid,
      request.leadReservationUid,
      request.officeId
    );
    return generalServiceResponse(
      {code: 100, ...data.dataValues},
      'Reservación creada correctamente'
    );
  };

  verifyReservationTime = async (
    request: IComplements.VerifyReservationTime
  ) => {
    const users = await this.userRepository.existsUser(request.uid);

    if (!users) {
      return generalServiceResponse(
        null,
        'Identificador del usuario es incorrecto'
      );
    }

    const checkReservationTime = await this.officeRepository.verifyReservationTime(
      request.date,
      request.startTime,
      request.endTime,
      request.uid
    );

    if (
      (!users.typePositionsId && !checkReservationTime.available) ||
      (users.typePositionsId === 2 && !checkReservationTime.available)
    ) {
      return generalServiceResponse(
        {code: 401, data: checkReservationTime.data},
        'Tienes un espacio reservado dentro del rango de tiempo especificado'
      );
    }

    return generalServiceResponse(
      {code: 100, available: true},
      'Tiempo disponible'
    );
  };

  verifyReservationsCheckIn = async () => {
    const checkReservationCheckIn = await this.officeRepository.verifyReservationsCheckIn();
    return generalServiceResponse({code: 100, data: {}}, 'Operación exitosa');
  };

  listUserReservations = async (request: IComplements.ListUserReservations) => {
    if (!(await this.userRepository.existsUser(request.uid)))
      return generalServiceResponse(
        null,
        'Identificador del usuario es incorrecto'
      );

    return generalServiceResponse(
      await this.officeRepository.listUserReservations(
        request.uid,
        request.limit,
        request.offset,
        request.filterReservation,
        request.filterDate
      ),
      'Operación exitosa'
    );
  };

  listNotificationReservationByUid = async (
    request: IComplements.UsersFavoritesOffices
  ) => {
    if (!(await this.userRepository.existsUser(request.uid)))
      return generalServiceResponse(
        null,
        'Identificador del usuario es incorrecto'
      );

    return generalServiceResponse(
      await this.notificationReservationRepository.listNotificationReservationByUid(
        request.uid,
        request.limit,
        request.offset
      ),
      'Operación exitosa'
    );
  };

  getReservationInfo = async (request: IComplements.ID) => {
    return generalServiceResponse(null, 'Servicio desactivado temporalmente');
    /* if (!(await this.officeRepository.exitsAndIsActiveReservation(request.id)))
      return generalServiceResponse(
        null,
        'La reservación no existe ó se encuentra cancelada'
      );

    const response = await this.officeRepository.getInfoAboutReservation(
      request.id
    );
    return generalServiceResponse(response, 'Operación exitosa');
    */
  };

  cancelReservation = async (request: IComplements.ID) => {
    if (!(await this.officeRepository.exitsAndIsActiveReservation(request.id)))
      return generalServiceResponse(
        null,
        'La reservación no existe ó se encuentra cancelada'
      );

    await this.officeRepository.cancelReservation(request.id);
    return generalServiceResponse(
      {success: true},
      'Su reservación ha sido cancelada'
    );
  };

  updateReservation = async (request: IComplements.UpdateReservation) => {
    if (
      !(await this.officeRepository.exitsAndIsActiveReservation(
        request.reservationId
      ))
    )
      return generalServiceResponse(
        null,
        'La reservación no existe ó se encuentra cancelada'
      );

    if (
      (await this.userRepository.findByUID(request.leadReservationUid)) === null
    )
      return generalServiceResponse(
        null,
        'El identificador del lider de la reservación es incorrecto, por favor verifique'
      );

    const existOffice = await this.officeRepository.getOfficeById(
      request.officeId
    );
    if (existOffice === null)
      return generalServiceResponse(
        null,
        'El identificador de la oficina es incorrecto'
      );

    if (
      !(
        await this.officeRepository.isAvailableOffice(
          request.date,
          request.startTime,
          request.endTime,
          request.officeId,
          0,
          request.reservationId
        )
      ).available
    )
      return generalServiceResponse(
        null,
        'Lo sentimos, no se encuentra disponible la configuración seleccionada'
      );
    return generalServiceResponse(
      this.officeRepository.updateReservation(
        request.reservationId,
        request.date,
        request.startTime,
        request.endTime,
        request.leadReservationUid,
        request.officeId
      ),
      'Reservación actualizada correctamente'
    );
  };

  checkQrOffice = async (request: IComplements.CheckQrOffice) => {
    const isValidCode = await this.officeRepository.checkQrOffice(
      request.officeId,
      request.code
    );
    // const isValidCode = true;
    return generalServiceResponse(
      {valid: isValidCode},
      'Verificación realizada'
    );
  };
}
