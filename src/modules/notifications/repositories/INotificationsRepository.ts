import ICreateNotificationDTO from "../dtos/ICreateNotificationDTO";
import Notification from '../infra/typeorm/schemas/Notification';

export default interface INotificationsRepository {
  //Método de criação de uma notificação onde o retorno dele será uma notificação:
  create(data: ICreateNotificationDTO): Promise<Notification>;
}
