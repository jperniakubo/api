import config from '../../../config';
import {IComplements} from '../../../resources/interfaces';
import {OnboardingAdminRepository} from '../../repository/v1/onboardingAdmin.repository';
import {UsersRepository} from '../../repository/v1/users.repository';
import {generalServiceResponse} from '../../../utils/GeneralHelpers';
const Path = require('path');
// Language
const language = `../../../resources/lang/${config.LANGUAGE}`;
const lang = require(language);

export class BoAdminService {
  private onboardingRepository: OnboardingAdminRepository = new OnboardingAdminRepository();
  private usersRepository: UsersRepository = new UsersRepository();

  loginAdmin = async (request: IComplements.BoAdminLogin) => {
    if (!(await this.onboardingRepository.existsAdmin(request.email)))
      return generalServiceResponse({code: 402}, 'Usuario incorecto');

    if (!(await this.onboardingRepository.isActiveAdmin(request.email)))
      return generalServiceResponse({code: 403}, 'Usuario inactivo');

    const resultLogin = await this.onboardingRepository.loginAdmin(
      request.email,
      request.password
    );
    //console.log(resultLogin);
    return resultLogin !== null
      ? generalServiceResponse(
          {code: 200, ...resultLogin.dataValues},
          'Operación exitosa'
        )
      : generalServiceResponse({code: 405}, 'Acceso incorrecto');
  };

  listAdmins = async (request: IComplements.ListBoAdmins) => {
    const data = await this.onboardingRepository.listAdmins(
      request.limit,
      request.offset,
      request.needle
    );
    return generalServiceResponse(data);
  };

  searchAdmins = async (request: IComplements.SearchRecords) => {
    const data = await this.onboardingRepository.searchAdmins(request.needle);
    return generalServiceResponse(data);
  };

  createAdmin = async (request: IComplements.CreateAdmin, filePicture: any) => {
    if (await this.onboardingRepository.existsAdmin(request.email))
      return generalServiceResponse(
        {code: 401},
        'Ya existe un administrador con el mismo correo electrónico'
      );

    // upload profile picture
    let avatar: any = filePicture.avatar;
    avatar.name = Date.now() + Path.extname(avatar.name);
    avatar.mv('./uploads/boAdminImages/' + avatar.name);

    const data = await this.onboardingRepository.createAdmin(
      request.fullName,
      request.position,
      request.email,
      request.password,
      avatar.name
    );
    return generalServiceResponse(data, 'Operación exitosa');
  };

  changeAdminState = async (request: IComplements.AdminState) => {
    if (!(await this.onboardingRepository.existsAdmin(request.id)))
      return generalServiceResponse(
        null,
        'El identificador del administrador es incorrecto'
      );

    const updateState = await this.onboardingRepository.changeAdminState(
      request.active,
      request.id
    );
    return generalServiceResponse(updateState);
  };

  updateAdmin = async (request: IComplements.UpdateAdmin, filePicture: any) => {
    let newFileName: string = '';
    if (
      !(
        filePicture === null ||
        !filePicture ||
        typeof filePicture === 'undefined'
      )
    ) {
      // upload profile picture
      let avatar: any = filePicture.avatar;
      avatar.name = Date.now() + Path.extname(avatar.name);
      avatar.mv('./uploads/boAdminImages/' + avatar.name);
      newFileName = avatar.name;
    }

    const resultUpdate: any = await this.onboardingRepository.updateAdmin(
      request.id,
      request.fullName,
      request.email,
      request.phoneNumber,
      request.position,
      request.oldPassword,
      request.newPassword,
      newFileName
    );
    if (resultUpdate.success)
      return generalServiceResponse(resultUpdate, 'Operación exitosa');

    return generalServiceResponse(null, resultUpdate.message);
  };

  getAdminInfoById = async (request: IComplements.ID) => {
    const data = await this.onboardingRepository.getAdminInfoById(request.id);
    return generalServiceResponse(data, 'Operación exitosa');
  };

  boListUsers = async (request: IComplements.BoListUsers) => {
    const data = await this.usersRepository.listUsers(
      request.needle,
      0
      // request.limit,
      // request.offset,
      // true
    );
    return generalServiceResponse(data, 'Operación exitosa');
  };

  updateUserState = async (request: IComplements.UserState) => {
    //console.log('aqui voy');

    if (!(await this.usersRepository.existsUser(request.uid)))
      return generalServiceResponse(
        null,
        'El identificador del usuario es incorrecto'
      );

    const data = await this.usersRepository.updateUserState(
      request.uid,
      request.active
    );
    return generalServiceResponse(data, 'Operación exitosa');
  };

  getBroadReportAboutUser = async (request: IComplements.UserUID) => {
    if (!(await this.usersRepository.existsUser(request.uid)))
      return generalServiceResponse(
        null,
        'El identificador del usuario es incorrecto'
      );

    const data = await this.usersRepository.getBroadReportAboutUser(
      request.uid
    );
    return generalServiceResponse(data, 'Operación exitosa');
  };
}
