import {Users} from '../../models/Users';
import {Repository} from '../generic';
import {UserClient} from '../../models/UserClient';
import {ConstantsManager} from '../../constants/constantsManager';
// repositories
import {ReservationOfficeRepository} from '../../repository/v1/reservationOffice.repository';
import {PositionsRepository} from './positions.repository';
import {PositionsPerOfficeTypeRepository} from './positionsPerOfficeType.repository';
import {TypePositions} from '../../models/TypePositions';

// export
const axios = require('axios');
const {Op, QueryTypes, Sequelize} = require('sequelize');
const KPMG = require('ssh-kpmg');

export class UsersRepository extends Repository {
  private constManager: ConstantsManager = new ConstantsManager();
  private reservationRepository: ReservationOfficeRepository = new ReservationOfficeRepository();
  private positionsRepository: PositionsRepository = new PositionsRepository();
  private positionsPerOfficeTypeRepository: PositionsPerOfficeTypeRepository = new PositionsPerOfficeTypeRepository();

  findStudentByUID = async (uid: string) => {
    const response = await this.one({where: {uid}, include: [UserClient]});
    return response;
  };

  findByUID = async (uid: string) => {
    const response = await this.singleCondition({uid});
    return response;
  };

  findByEmail = async (email: string) => {
    const response = await this.singleCondition({email});
    return response;
  };

  findUserByEmail = async (email: string) => {
    const response = await this.one({
      attributes: [
        'uid',
        'slug',
        'fullName',
        'email',
        'phone',
        'position',
        'password',
        'linkedinProfile',
        'qrCode',
        'document',
        [
          Sequelize.fn(
            'CONCAT',
            this.constManager.getUrlUserImages(),
            Sequelize.col('profileImage')
          ),
          'profileImage'
        ],
        'checkUserId',
        'typePositionsId',
        'status',
        'createdAt',
        'updatedAt'
      ],
      where: {
        email
      }
    });
    return response;
  };

  createClient = (data?: Object): Promise<any> => {
    return UserClient.create(data);
  };

  existsUser = async (uid: string) => {
    const user = await this.one({
      attributes: ['uid', 'email', 'typePositionsId'],
      where: {
        uid,
        status: 'active'
      }
    });
    return user !== null ? user.dataValues : false;
  };

  getUserInfo = async (uid: string) => {
    // this.setModel(Users);
    const user = await this.one({
      where: {
        uid
      },
      attributes: [
        'uid',
        'fullName',
        'email',
        'phone',
        'position',
        [
          Sequelize.fn(
            'CONCAT',
            this.constManager.getUrlUserImages(),
            Sequelize.col('profileImage')
          ),
          'profileImage'
        ]
      ]
    });
    // return user;
    return user.dataValues;
  };

  // Status
  changeCheckUserUID = async (
    uid: string,
    checkUserId: number,
    status = 'active'
  ) => {
    await this.update({checkUserId, status}, {uid});
  };

  listUsers = async (
    needle: string,
    officeTypeId: number,
    // limit: number = 50,
    // offset: number = 0,
    countReservationsByUser: boolean = false
  ) => {
    const positionsPerOffType = await this.positionsPerOfficeTypeRepository.getPositionPerOffTypeByOfficeTypeId(
      officeTypeId
    );
    const arrayPositionsId = [];
    for (const positionPerOffic of positionsPerOffType) {
      arrayPositionsId.push({id: positionPerOffic.dataValues.positionId});
    }
    const positions = await this.positionsRepository.getPositionByArrayIds(
      arrayPositionsId
    );
    const arrayPositionNames = [];
    for (const positionData of positions) {
      arrayPositionNames.push({position: positionData.dataValues.name});
    }
    const whereClause: Object =
      needle.length === 0
        ? {
            // limit,
            // offset,
            where: {
              [Op.or]: arrayPositionNames,
              status: 'active'
            },
            order: [['createdAt', 'asc']]
          }
        : {
            where: {
              [Op.and]: [
                {
                  [Op.or]: [
                    {fullName: {[Op.substring]: needle}},
                    {email: {[Op.substring]: needle}},
                    {position: {[Op.substring]: needle}}
                  ]
                },
                {[Op.or]: arrayPositionNames}
              ],
              status: 'active'
            },
            // limit,
            // offset,
            order: [['createdAt', 'asc']]
          };
    const users = await this.all(whereClause);

    for (const user of users) {
      delete user.dataValues.slug;
      delete user.dataValues.password;
      delete user.dataValues.checkUserId;
      if (user.get('profileImage') !== '')
        user.set(
          'profileImage',
          this.constManager.getUrlUserImages() + user.get('profileImage')
        );

      if (countReservationsByUser == true)
        user.dataValues.amountOfReservations = await this.reservationRepository.countReservationsByUser(
          user.get('uid')
        );
    }
    return users;
  };

  editUser = async (
    uid: string,
    position: string,
    fullName: string,
    document: string,
    email: string,
    linkedinProfile: string,
    profileImage: string = ''
  ) => {
    const objectUser: any = {
      fullName,
      email,
      document,
      position,
      linkedinProfile
    };
    if (profileImage.length !== 0 && profileImage !== '')
      objectUser.profileImage = profileImage;

    await this.update(objectUser, {uid});
    const user = await this.one({
      where: {
        uid
      }
    });
    user.dataValues.profileImage = `${this.constManager.getUrlUserImages()}${
      user.dataValues.profileImage
    }`;
    return user;
  };

  editUserOnlyImage = async (uid: string, profileImage: string = '') => {
    const objectUser: any = {};
    if (profileImage.length !== 0 && profileImage !== '') {
      objectUser.profileImage = profileImage;
    }

    await this.update(objectUser, {uid});
    const user = await this.one({
      where: {
        uid
      }
    });
    user.dataValues.profileImage = `${this.constManager.getUrlUserImages()}${
      user.dataValues.profileImage
    }`;
    return user;
  };

  getBroadReportAboutUser = async (uid: string) => {
    const user = await this.one({
      where: {
        uid
      }
    });
    user.set('password', '');
    user.set(
      'profileImage',
      this.constManager.getUrlUserImages() + user.get('profileImage')
    );
    user.dataValues.listReservations = await this.reservationRepository.listReservationsFromUser(
      uid,
      100,
      0,
      0,
      0,
      ''
    );
    user.dataValues.totalReservations = await this.reservationRepository.countReservationsByUser(
      uid
    );
    user.dataValues.activeReservations = await this.reservationRepository.countReservationsByUser(
      uid,
      'active'
    );
    user.dataValues.cancelledReservations = await this.reservationRepository.countReservationsByUser(
      uid,
      'inactive'
    );
    return user;
  };

  updateUserState = async (uid: string, active: number) => {
    // await this.update({ status: active === 1  ? 'active' : 'inactive' }, {uid});
    return {success: true, message: 'Cambio de estado correcto'};
  };

  existOnDirectory = async (email: string, password: string) => {
    //console.log(email, passwrod);
    const connection = new KPMG(email, password);

    const response = await connection
      .tryToConnect()
      .then(function (status: any) {
        return status;
      })
      .catch(function (status: any) {
        return status;
      });
    return response;
  };

  kpmgAuthenticate = async (username: string, password: string) => {
    const config = {};
    const object = {
      Username: username,
      Password: password
    };

    console.log(object);
    const response = await axios
      .post(
        'https://apikactusonekey.co.kworld.kpmg.com/api/login/authenticate',
        object,
        config
      ) // url to production environment
      .then(function (json: any) {
        return json.data;
      })
      .catch(function (error: any) {
        console.log('error', error);
        return error.response;
      });
    console.log('response repository', response);
    return response;
  };

  kpmgUserByName = async (bearerToken: string, name: string) => {
    const config = {
      headers: {Authorization: `Bearer ${bearerToken}`}
    };
    const object = {
      name
    };
    const response = await axios
      .post(
        'https://apikactusonekey.co.kworld.kpmg.com/api/empleados/',
        object,
        config
      ) // url to production environment
      .then(function (json: any) {
        return json.data;
      })
      .catch(function (error: any) {
        return error.response;
      });
    return response;
  };

  kpmgUserByParameter = async (bearerToken: string, parameter: string) => {
    const config = {
      headers: {Authorization: `Bearer ${bearerToken}`}
    };
    const response = await axios
      .get(
        `https://apikactusonekey.co.kworld.kpmg.com/api/empleados/GetByParameter?parameter=${parameter}`,
        config
      )
      .then(function (json: any) {
        console.log('peticion empleado 1', response);
        return json.data;
      })
      .catch(function (error: any) {
        console.log('peticion empleado 2', response);
        return error.response;
      });
    console.log('peticion empleado', response);
    return response;
  };

  saveUser = async (
    uid: string,
    names: string,
    surnames: string,
    email: string,
    position: string,
    qrCode: string
  ) => {
    const fullName = `${names} ${surnames}`;
    const user = await this.one({
      where: {
        uid
      }
    });
    if (user === null) {
      const objectUser: any = {
        uid,
        slug: `users/${uid}`,
        fullName,
        email,
        phone: '',
        document: '',
        password: '',
        position,
        checkUserId: 2,
        linkedinProfile: '',
        profileImage: '',
        qrCode
      };

      console.log('User create', objectUser);

      await this.create(objectUser);
      const userCreated = await this.one({
        where: {
          uid
        }
      });
      return userCreated;
    } else {
      const objectUser: any = {
        uid,
        slug: `users/${uid}`,
        fullName,
        email,
        phone: '',
        document: '',
        password: '',
        position,
        checkUserId: 2,
        linkedinProfile: '',
        profileImage: '',
        qrCode
      };

      console.log('User update', objectUser);

      await this.update(objectUser, {uid});
      const userUpdated = await this.one({
        where: {
          uid
        }
      });

      console.log('usuario actualizado', userUpdated);
    }

    user.dataValues.profileImage = `${this.constManager.getUrlUserImages()}${
      user.dataValues.profileImage
    }`;
    return user;
  };

  constructor() {
    super();
    this.setModel(Users);
  }
}
