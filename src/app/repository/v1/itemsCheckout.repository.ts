import {Repository} from '../generic';
import {ItemsCheckOut} from '../../models/ItemsCheckOut';
// export
export class ItemsCheckOutRepository extends Repository {
  saveItemsCheckout = async (itemsCheckOut: string, checkOutId: number) => {
    let arrayItems = itemsCheckOut.split(',');
    for (const item of arrayItems) {
      await this.create({
        checked: 1,
        officeItemId: item,
        checkOutId: checkOutId
      });
    }
  };

  constructor() {
    super();
    this.setModel(ItemsCheckOut);
  }
}
