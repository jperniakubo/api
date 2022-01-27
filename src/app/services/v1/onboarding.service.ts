import moment from 'moment';
import sha1 from 'crypto-js/sha1';
import jwt from 'jsonwebtoken';
import {Request} from 'express';
import {v4 as uid} from 'uuid';

import config from '../../../config';
import {
  UserTokenRepository,
  UsersRepository,
  PasswordResetRepository
} from '../../repository';
import {UserCodeVerificationRepository} from '../../repository/v1/userCodeVerification.repository';
import {IUser, IComplements} from '../../../resources/interfaces';
import {generalServiceResponse} from '../../../utils/GeneralHelpers';
// Language
const language = `../../../resources/lang/${config.LANGUAGE}`;
const lang = require(language);
import {CryptoUtil} from '../../../utils/crypto';

export class OnboardingService {
  usersRepository = new UsersRepository();
  userTokenRepository = new UserTokenRepository();
  userCodeVerificationRepository = new UserCodeVerificationRepository();

  generateAccessToken = (): Object => {
    const payload = {
      iat: moment().unix()
    };
    const accessToken: string = jwt.sign({data: payload}, this.signature(), {
      expiresIn: '1y'
    });
    return {status: true, data: {accessToken}};
  };

  checkAccessToken = async (request: Request) => {
    const header =
      request.header(`X-${config.SHORT_NAME}-Access-Token`) || 'ERROR';

    if (typeof header === 'undefined') {
      return {
        status: false,
        message: lang.Onboarding.HEADER.NOT_FOUND
      };
    }
    try {
      const verify = await jwt.verify(header, this.signature());
      return {
        status: true,
        message: lang.Onboarding.ACCESS_TOKEN.MAKE
      };
    } catch (error) {
      return {
        status: false,
        message: lang.Onboarding.TOKEN.INVALID,
        data: {name: error.name, message: error.message}
      };
    }
  };

  generateAuthToken = async (user: IUser.AuthTokenDTO) => {
    let authToken: any;
    // eslint-disable-next-line no-shadow
    const uid = user.uid;
    if (uid) {
      const userExists = await this.userTokenRepository.findByUID(uid);
      if (typeof userExists !== 'undefined' && userExists !== null) {
        authToken = userExists.get('authToken');
      } else {
        const payload = {
          iat: moment().unix(),
          user
        };
        authToken = jwt.sign({data: payload}, this.signature(), {
          expiresIn: '1h'
        });
      }
      const date = new Date();
      const authTokenDTO: IUser.AuthDTO = {
        ...user,
        authToken,
        maxDate: new Date(date.setFullYear(date.getFullYear() + 1)),
        updated: false
      };
      await this.userTokenRepository.create(authTokenDTO);
    }
    return authToken;
  };

  checkAuthToken = async (request: Request, getData?: Boolean) => {
    const header =
      request.header(`X-${config.SHORT_NAME}-Auth-Token`) || 'ERROR';

    if (typeof header === 'undefined') {
      return {
        status: false,
        message: lang.Onboarding.HEADER.NOT_FOUND
      };
    }

    try {
      return await jwt.verify(
        header,
        this.signature(),
        async (err, decoded: any) => {
          const errorObject = {
            status: false,
            message: lang.Onboarding.USER.ERROR.NOT_FOUND_TOKEN
          };

          if (
            typeof decoded === 'undefined' ||
            typeof decoded.data === 'undefined'
          ) {
            return errorObject;
          }

          const userExists = await this.userTokenRepository.findUserByAuthToken(
            header
          );
          if (!userExists) {
            return errorObject;
          }

          if (getData) {
            const data = await this.usersRepository.findStudentByUID(
              userExists.get('uid')
            );
            return {
              status: true,
              data
            };
          }
          return {
            status: true,
            message: lang.Onboarding.AUTH_TOKEN.MAKE
          };
        }
      );
    } catch (error) {
      return {
        status: false,
        message: lang.Onboarding.TOKEN.INVALID,
        data: {name: error.name, message: error.message}
      };
    }
  };

  signUp = async (userSignUpDTO: IUser.SignUpDTO) => {
    // Format Data
    const email = userSignUpDTO.email.toLowerCase();
    // eslint-disable-next-line no-param-reassign
    userSignUpDTO.email = email;
    // Check if User Exist
    const userExists = await this.usersRepository.findByEmail(email);
    if (userExists) {
      return {
        status: false,
        message: lang.Onboarding.SIGNUP.ERROR.EMAIL_EXIST
      };
    }
    // Generate Password
    const hashedPassword = userSignUpDTO.password
      ? sha1(userSignUpDTO.password).toString()
      : null;
    // Set New Data
    const getUID = uid();
    const data: IUser.SignUpDTO = {
      ...userSignUpDTO,
      email,
      password: hashedPassword ?? '',
      slug: sha1(email + getUID).toString(),
      uid: getUID,
      checkUserId: 1,
      status: 'inactive'
    };
    // Make User
    const userRecord = await this.usersRepository.create(data);
    if (this.usersRepository.isEmpty(userRecord)) {
      return {
        status: false,
        message: lang.Onboarding.SIGNUP.ERROR.MAKE_USER
      };
    }
    // Get Response - User
    return {
      status: true,
      data,
      message: lang.Onboarding.SIGNUP.MAKE_USER
    };
  };

  createClient = async (request: IUser.SignUpDTO | IComplements.CRUDImage) => {
    const data = await this.usersRepository.createClient(request);
    if (this.usersRepository.isEmpty(data)) {
      return {
        status: false,
        message: lang.STACK.CRUD.ERROR.MAKE
      };
    }
    return {
      status: true,
      data: request,
      message: lang.STACK.CRUD.MAKE
    };
  };

  // eslint-disable-next-line no-shadow
  confirmEmail = async (uid: string) => {
    // Check if User Exist
    const usersRepository = new UsersRepository();
    const userExists = await usersRepository.findByUID(uid);
    if (!userExists) {
      return {
        status: false,
        message: lang.Onboarding.USER.ERROR.NOT_FOUND
      };
    }
    // eslint-disable-next-line no-warning-comments
    // TODO: User Re Check

    await usersRepository.changeCheckUserUID(uid, 2);
    return {
      status: true,
      message: lang.Onboarding.USER.CHECK_EMAIL.SUCCESS
    };
  };

  recoveryPassword = async (email: string) => {
    // Check if User Exist
    const passwordResetRepository = new PasswordResetRepository();
    const usersRepository = new UsersRepository();
    const userExists: any = await usersRepository.singleCondition({
      email
    });

    if (typeof userExists !== 'undefined' || !userExists) {
      return {
        status: false,
        message: lang.Onboarding.USER.ERROR.NOT_FOUND
      };
    }
    // Logic
    // eslint-disable-next-line no-shadow
    const uid = userExists!.get('uid');
    await passwordResetRepository.destroy({uid});
    const code = this.getRndInteger(1000, 9999);
    const userRecord = await passwordResetRepository.create({
      code,
      uid
    });

    return {
      status: true,
      data: {
        user: {
          email: userExists!.get('email'),
          fullName: userExists!.get('fullName')
        },
        code
      },
      message: lang.Onboarding.RECOVERY.SUCCESS
    };
  };

  checkCode = async (code: string) => {
    // Check if User Exist
    const passwordResetRepository = new PasswordResetRepository();
    const codeExist = await passwordResetRepository.singleCondition({
      code
    });
    if (!codeExist) {
      return {
        status: false,
        message: lang.Onboarding.RECOVERY.CODE.ERROR.NOT_FOUND
      };
    }
    return {
      status: true,
      message: lang.Onboarding.RECOVERY.CODE.SUCCESS
    };
  };

  changePassword = async (IUserRecoveryDTO: IUser.RecoveryDTO) => {
    // Check if User Exist
    const passwordResetRepository = new PasswordResetRepository();
    const usersRepository = new UsersRepository();
    const code = IUserRecoveryDTO.code;
    const codeExist = await passwordResetRepository.singleCondition({
      code
    });
    if (!codeExist) {
      return {
        status: false,
        message: lang.Onboarding.RECOVERY.CODE.ERROR.NOT_FOUND
      };
    }
    // Generate Password
    // eslint-disable-next-line no-shadow
    const uid = codeExist.uid;
    const hashedPassword = IUserRecoveryDTO.password
      ? sha1(IUserRecoveryDTO.password).toString()
      : null;

    const userRecord = await usersRepository.update(
      {password: hashedPassword, checkUserId: 2, status: 'active'},
      uid
    );

    // Remode data
    await passwordResetRepository.destroy({code});
    return {
      status: true,
      message: lang.Onboarding.RECOVERY.CHANGE_PASSWORD
    };
  };

  getCodeVerification = async (request: IUser.UidParam) => {
    if (!(await this.usersRepository.existsUser(request.uid)))
      return generalServiceResponse(
        null,
        'Identificador del usuario es incorrecto'
      );
    const data = await this.userCodeVerificationRepository.getCodeVerification(
      request.uid
    );
    return generalServiceResponse(data, 'Operación exitosa');
  };

  verifyCode = async (request: IUser.UidCode) => {
    if (!(await this.usersRepository.existsUser(request.uid)))
      return generalServiceResponse(
        null,
        'Identificador del usuario es incorrecto'
      );
    const data = await this.userCodeVerificationRepository.verifyCode(
      request.uid,
      request.code
    );
    if (data) {
      return generalServiceResponse(data, 'Operación exitosa');
    } else {
      return generalServiceResponse(null, 'El código ingresado es incorrecto');
    }
  };

  login = async (userSignInDTO: IUser.SignInDTO, route: string = 'users') => {
    if (!userSignInDTO.email) {
      return {
        status: false,
        message: lang.Onboarding.SIGNIN.ERROR.SIGNIN
      };
    }
    // Check if User Exist
    const user: any = await this.usersRepository.findUserByEmail(
      userSignInDTO.email
    );

    console.log('userss', user);

    if (!user) {
      return {
        status: false,
        // message: lang.Onboarding.USER.ERROR.NOT_FOUND
        message: 'El usuario o contraseña es incorrecto.'
      };
    }
    // Check Password
    // const hashedPassword = await sha1(userSignInDTO.password).toString();
    console.log('mmm');
    console.log('mmm');
    console.log('mmm');
    console.log('mmm', userSignInDTO.password, user!.get('password'));

    // if (userSignInDTO.password !== user!.get('password')) {
    //   return {
    //     status: false,
    //     // message: lang.Onboarding.SIGNIN.ERROR.PASSWORD
    //     message: 'El usuario o contraseña es incorrecto.'
    //   };
    // }

    // Check Inactive
    if (user!.get('checkUserId') === 1) {
      return {
        status: false,
        code: 402,
        message: lang.Onboarding.SIGNIN.ERROR.VERIFY_EMAIL
      };
    }

    if (user!.get('status') === 'inactive') {
      return {
        status: false,
        message: lang.Onboarding.SIGNIN.ERROR.INACTIVE
      };
    }

    if (user!.get('typePositionsId') === null) {
      user.dataValues.typePositionsId = 0;
    }
    const data: IUser.AuthTokenDTO = userSignInDTO;
    data.uid = user.get('uid');
    const authToken = await this.generateAuthToken(data);

    user.setDataValue('password', '');
    user.setDataValue('checkUserId', '');
    // user.setDataValue('document', '');
    user.setDataValue('version', userSignInDTO.version);
    user.setDataValue('authToken', authToken);
    user.setDataValue('slug', `${route}/${user.get('slug')}`);
    return {
      status: true,
      message: lang.Onboarding.SIGNIN.SUCCESS,
      data: user as IUser.SigInDTO
    };
  }; // end

  login2 = async (userSignInDTO: IUser.SignInDTO, route: string = 'users') => {
    const password = CryptoUtil.decrypt(
      userSignInDTO.password,
      userSignInDTO.iv
    );
    console.log('password', password);

    const emailUser = userSignInDTO.email;
    if (
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        emailUser
      )
    ) {
      userSignInDTO.email = emailUser.replace('@kpmg.com', '');
    } else {
      return {
        status: false,
        message: 'Este correo electrónico es incorrecto'
      };
    }
    // Check if User Exist
    const user: any = await this.usersRepository.existOnDirectory(
      userSignInDTO.email,
      password
    );

    console.log('user service', user);

    if (user) {
      const authenticate: any = await this.usersRepository.kpmgAuthenticate(
        'us3rK4ctu2',
        '!H6QPfzokCoF'
      );
      if (typeof authenticate !== 'undefined' && authenticate !== undefined) {
        const userByParameter: any = await this.usersRepository.kpmgUserByParameter(
          authenticate,
          userSignInDTO.email
        );
        console.log('getparameter');
        console.log('email', userSignInDTO.email);
        console.log('response', userByParameter);
        if (
          typeof userByParameter !== 'undefined' &&
          userByParameter !== undefined
        ) {
          const userCreated: any = await this.usersRepository.saveUser(
            userByParameter[0].cod_empl,
            userByParameter[0].nom_empl,
            userByParameter[0].ape_empl,
            userByParameter[0].box_mail,
            userByParameter[0].nom_carg,
            userByParameter[0].cod_empl
          );

          if (userCreated.dataValues.status !== 'active') {
            return {
              status: false,
              message: 'Usuario inactivo.'
            };
          }
          if (userCreated!.get('typePositionsId') === null) {
            userCreated.dataValues.typePositionsId = 0;
          }

          const data: IUser.AuthTokenDTO = userSignInDTO;
          data.uid = userCreated.get('uid');
          const authToken = await this.generateAuthToken(data);

          userCreated.setDataValue('password', '');
          userCreated.setDataValue('checkUserId', '');
          userCreated.setDataValue('version', userSignInDTO.version);
          userCreated.setDataValue('authToken', authToken);
          userCreated.setDataValue(
            'slug',
            `${route}/${userCreated.get('slug')}`
          );

          return {
            status: true,
            message: lang.Onboarding.SIGNIN.SUCCESS,
            data: userCreated as IUser.SigInDTO
          };
        } else {
          return {
            status: false,
            message:
              'Error de conexión con Kactus al verificar datos de usuario.'
          };
        }
      } else {
        return {
          status: false,
          message: 'Error de conexión con Kactus en autenticación.'
        };
      }
    } else {
      return {
        status: false,
        message: lang.Onboarding.USER.ERROR.NOT_FOUND
      };
    }
  };

  profile = async (request: Request) => {
    const data = await this.checkAuthToken(request, true);
    return data;
  };

  private getRndInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private signature() {
    const encryptKey = Buffer.from(
      JSON.stringify(config.PROJECT + config.SHORT_NAME),
      'utf-8'
    ).toString('base64');
    return sha1(encryptKey).toString();
  }
}
