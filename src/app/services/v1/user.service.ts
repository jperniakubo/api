import config from '../../../config';
import {IComplements} from '../../../resources/interfaces';
import {UsersRepository} from '../../repository/v1/users.repository';
import {generalServiceResponse} from '../../../utils/GeneralHelpers';

const Path = require('path');

export class UserService {
  private userRepository: UsersRepository = new UsersRepository();

  listUsers = async (request: IComplements.ClassicSearchUser) => {
    const users = await this.userRepository.listUsers(
      request.needle,
      request.officeTypeId
    );
    return generalServiceResponse(users, 'Operación exitosa');
  };

  editUser = async (request: IComplements.EditUserOnlyImage, file: any) => {
    if (!(await this.userRepository.existsUser(request.uid)))
      return generalServiceResponse(
        null,
        'El identificador del usuario es incorrecto o se encuentra inactivo'
      );

    let profileImage: any;
    if (file === null || file.length === 0) {
      profileImage = {name: ''};
    } else {
      profileImage = file.profileImage;
      profileImage.name = Date.now() + Path.extname(profileImage.name);
      profileImage.mv(`./uploads/users/${profileImage.name}`);
    }
    // const userUpdated = await this.userRepository.editUser(
    //   request.uid,
    //   request.position,
    //   request.fullName,
    //   request.document,
    //   request.email,
    //   request.linkedinProfile,
    //   profileImage.name
    // );
    const userUpdated = await this.userRepository.editUserOnlyImage(
      request.uid,
      profileImage.name
    );
    return generalServiceResponse(
      userUpdated,
      'Usuario actualizado correctamente'
    );
  };
}
