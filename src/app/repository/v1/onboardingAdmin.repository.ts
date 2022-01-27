import {Repository} from '../generic';
import {BoAdmin} from '../../models/BoAdmin';
import {ConstantsManager} from '../../constants/constantsManager';

const {Op} = require('sequelize');

// export
export class OnboardingAdminRepository extends Repository {
  private constManager: ConstantsManager = new ConstantsManager();

  // check by email or id
  existsAdmin = async (identifier: string | number) => {
    this.setModel(BoAdmin);
    let whereObject: object;
    whereObject =
      typeof identifier === 'string'
        ? {where: {email: identifier}}
        : {where: {id: identifier}};

    const admin = await this.one(whereObject);
    return admin !== null;
  };

  isActiveAdmin = async (email: string) => {
    const admin = await this.one({
      where: {
        email: email,
        status: 'active'
      }
    });
    return admin !== null;
  };

  loginAdmin = async (email: string, password: string) => {
    const admin = await this.one({
      where: {
        email: email,
        password: password,
        status: 'active'
      }
    });
    if (admin !== null) delete admin.dataValues.password;

    return admin;
  };

  // for now this function is deprecated... it was replaced by: searchAdmins
  listAdmins = async (limit: number, offset: number, needle: string = '') => {
    console.log('el needle es: ' + needle);

    let whereClause: Object =
      needle.length === 0
        ? {}
        : {
            [Op.or]: [
              {fullName: {[Op.substring]: needle}},
              {email: {[Op.substring]: needle}}
            ]
          };
    whereClause = {
      ...whereClause,
      limit: limit,
      offset: offset,
      attributes: {exclude: ['password']}
    };
    return await this.all(whereClause);
  };

  searchAdmins = async (needle: string) => {
    //console.log('el needle es', needle);
    return await this.all({
      where: {
        [Op.or]: [
          {
            fullName: {[Op.like]: '%' + needle + '%'}
          },
          {
            email: {[Op.like]: '%' + needle + '%'}
          }
        ]
      },
      limit: 50, // by default,
      offset: 0
    });
  };

  createAdmin = async (
    fullName: string,
    position: string,
    email: string,
    password: string,
    profileImage: string
  ) => {
    await this.create({
      fullName: fullName,
      position: position,
      email: email,
      password: password,
      profileImage: profileImage,
      documentType: '',
      document: '',
      phoneNumber: '',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    const newAdmin = await this.one({
      where: {
        email: email
      },
      attributes: {exclude: ['password']}
    });
    newAdmin.dataValues.profileImage =
      String(new ConstantsManager().getUrlBoAdminAvatar()) +
      newAdmin.dataValues.profileImage;
    newAdmin.dataValues.code = 100;
    return newAdmin;
  };

  changeAdminState = async (active: number, id: number) => {
    await this.update(
      {
        status: active === 1 ? 'active' : 'inactive'
      },
      {id}
    );
    return await this.one({
      where: {id: id}
    });
  };

  updateAdmin = async (
    id: number,
    fullName: string,
    email: string,
    phoneNumber: string,
    position: string,
    oldPassword: string,
    newPassword: string,
    profileImage: string = ''
  ) => {
    const admin = await this.one({
      where: {
        id: id
      }
    });
    let adminDataToUpdate: any = {
      fullName: fullName,
      email: email,
      phoneNumber: phoneNumber,
      position: position
    };
    if (oldPassword !== '' && newPassword !== '') {
      if (admin.dataValues.password !== oldPassword)
        return {success: false, message: 'La contraseña actual es incorrecta'};

      adminDataToUpdate.password = newPassword;
    }
    if (profileImage !== '') adminDataToUpdate.profileImage = profileImage;

    if (await this.existsAnotherAdminWithSameEmail(id, email))
      return {
        success: false,
        message: 'Existe otro usuario con el nuevo correo ingresado'
      };

    await this.update(adminDataToUpdate, {id});
    const newAdminData = await this.one({
      where: {
        id: id
      }
    });
    newAdminData.set('password', '');
    if (newAdminData.get('profileImage') !== '')
      newAdminData.set(
        'profileImage',
        this.constManager.getUrlBoAdminAvatar() +
          newAdminData.get('profileImage')
      );

    return {
      success: true,
      message: 'Datos actualizados correctamente',
      adminData: newAdminData.dataValues
    };
  };

  existsAnotherAdminWithSameEmail = async (id: number, email: string) => {
    const admin = await this.one({
      where: {
        [Op.and]: [{email: email}, {id: {[Op.ne]: id}}]
      }
    });
    return admin !== null;
  };

  getAdminInfoById = async (boAdminId: number) => {
    const admin = await this.one({
      where: {
        id: boAdminId
      }
    });
    admin.set('password', '');
    if (admin.get('profileImage') !== '')
      admin.set(
        'profileImage',
        this.constManager.getUrlBoAdminAvatar() + admin.get('profileImage')
      );

    return admin;
  };

  constructor() {
    super();
    this.setModel(BoAdmin);
  }
}
