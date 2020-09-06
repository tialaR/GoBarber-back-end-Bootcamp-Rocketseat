import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import { ObjectId } from 'mongodb';
import Notification from '../../infra/typeorm/schemas/Notification';

class FakeNotificationsRepository
implements INotificationsRepository {
  private notifications: Notification[] =[];

  //Método que vai criar e salvar uma notificação no MongoBD:
  public async create({ content, recipient_id }: ICreateNotificationDTO): Promise<Notification> {
    //Criando:
    const notification = new Notification();
    Object.assign(notification, { id: new ObjectId(), content, recipient_id });

    //Salvando:
    this.notifications.push(notification);

    return notification;
  }
}

export default FakeNotificationsRepository;

