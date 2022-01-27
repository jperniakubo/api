import sha1 from 'crypto-js/sha1';
import {timestampWithMs} from '@sentry/utils';

import config from '../../../config';
import {SystemTimeAvailableRepository} from '../../repository/v1/systemTimeAvailable.repository';
import {IComplements} from '../../../resources/interfaces';
import {generalServiceResponse} from '../../../utils/GeneralHelpers';
// Language
const language = `../../../resources/lang/${config.LANGUAGE}`;
const lang = require(language);

export class SystemTimeAvailableService {
  systemTimeAvailableRepository: SystemTimeAvailableRepository = new SystemTimeAvailableRepository();

  getTime = async () => {
    const data = await this.systemTimeAvailableRepository.getTime();
    return generalServiceResponse(data, 'Operación exitosa');
  };
}
