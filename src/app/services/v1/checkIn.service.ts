import {type} from 'os';

import config from '../../../config';
import {IComplements} from '../../../resources/interfaces';
import {CheckInRepository} from '../../repository/v1/checkIn.repository';
import {OfficeRepository} from '../../repository/v1/office.repository';
import {generalServiceResponse} from '../../../utils/GeneralHelpers';
import {CheckOutRepository} from '../../repository/v1/checkOut.repository';
import {ConstantsManager} from '../../constants/constantsManager';

const Path = require('path');
// Language
const language = `../../../resources/lang/${config.LANGUAGE}`;
const lang = require(language);

export class CheckInService {
  private checkInRepository: CheckInRepository = new CheckInRepository();
  private officeRepository: OfficeRepository = new OfficeRepository();
  private constantsManager: ConstantsManager = new ConstantsManager();

  makeCheckIn = async (request: IComplements.MakeCheckIn, files: any) => {
    // validations here...
    if (
      !(await this.officeRepository.exitsAndIsActiveReservation(
        request.reservationId
      ))
    )
      return generalServiceResponse(
        null,
        'El identificador de la reservación es incorrecto'
      );

    if (
      await this.checkInRepository.checkInIsDone(
        request.reservationId,
        request.officeId
      )
    )
      return generalServiceResponse(
        null,
        'El check In de esta reservación ya se realizó previamente'
      );

    const arrayImagesNames: string[] = [];
    const baseUrlApi = this.constantsManager.getBaseUrl();
    if (!(files === null || !files || typeof files === 'undefined')) {
      const imgValues = Object.values(files);
      for (const element of imgValues) {
        const img: any = element;
        const newImageName = Date.now() + Path.extname(img.name);
        img.name = newImageName;
        await img.mv(`./uploads/checkInImages/${img.name}`);
        // arrayImagesNames.push(newImageName);
        arrayImagesNames.push(`${baseUrlApi}checkInImages/${newImageName}`);
      }
    }
    const response = await this.checkInRepository.makeCheckIn(
      request.reservationId,
      request.comment,
      request.itemsCheckIn,
      request.officeId,
      request.amountOfPeople,
      arrayImagesNames
    );
    return generalServiceResponse(response, 'Check in realizado exitosamente');
  };
}
