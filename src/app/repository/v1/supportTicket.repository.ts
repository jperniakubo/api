import {Repository} from '../generic';
import {SupportTicket} from '../../models/SupportTicket';
// export
export class SupportTicketRepository extends Repository {
  createSupportTicket = async (message: string, uid: string) => {
    await this.create({
      message,
      uid
    });
    const newSupport = await this.one({
      where: {
        message,
        uid
      }
    });
    return newSupport;
  };

  constructor() {
    super();
    this.setModel(SupportTicket);
  }
}
