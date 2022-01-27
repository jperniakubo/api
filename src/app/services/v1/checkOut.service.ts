import config from '../../../config';
import {IComplements} from '../../../resources/interfaces';
import {CheckOutRepository} from '../../repository/v1/checkOut.repository';
import {OfficeRepository} from '../../repository/v1/office.repository';
import {generalServiceResponse} from '../../../utils/GeneralHelpers';
import {ConstantsManager} from '../../constants/constantsManager';

const Path = require('path');
// Language
const language = `../../../resources/lang/${config.LANGUAGE}`;
const lang = require(language);

export class CheckOutService {
  private checkOutRepository: CheckOutRepository = new CheckOutRepository();
  private officeRepository: OfficeRepository = new OfficeRepository();
  private constantsManager: ConstantsManager = new ConstantsManager();

  makeCheckOut = async (request: IComplements.MakeCheckOut, files: any) => {
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
      await this.checkOutRepository.checkOutIsDone(
        request.reservationId,
        request.officeId
      )
    )
      return generalServiceResponse(
        null,
        'El check out de esta reservación ya fue realizada previamente'
      );

    // upload images
    const arrayImagesNames: string[] = [];
    const baseUrlApi = this.constantsManager.getBaseUrl();
    if (!(files === null || typeof files === 'undefined')) {
      const imgValues = Object.values(files);
      for (const element of imgValues) {
        const img: any = element;
        const newImageName = Date.now() + Path.extname(img.name);
        img.name = newImageName;
        await img.mv(`./uploads/checkOutImages/${img.name}`);
        // arrayImagesNames.push(newImageName);
        arrayImagesNames.push(`${baseUrlApi}checkOutImages/${newImageName}`);
      }
    }
    const response = await this.checkOutRepository.makeCheckOut(
      request.reservationId,
      request.comment,
      request.itemsCheckOut,
      request.officeId,
      request.amountOfPeople,
      arrayImagesNames
    );
    return generalServiceResponse(response, 'Check out realizado exitosamente');
  };
}
