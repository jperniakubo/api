import {Repository} from '../generic';
import {ImagesCheckOut} from '../../models/ImagesCheckOut';
// export
export class ImagesCheckOutRepository extends Repository {
  saveImagesCheckOut = async (images: string[], checkOutId: number) => {
    for (const img of images) {
      await this.create({
        image: img,
        checkOutId: checkOutId,
        status: 'active'
      });
    }
  };

  constructor() {
    super();
    this.setModel(ImagesCheckOut);
  }
}
