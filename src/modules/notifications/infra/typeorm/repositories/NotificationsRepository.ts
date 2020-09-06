import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import { getMongoRepository, MongoRepository } from 'typeorm';
import Notification from '../schemas/Notification';

class NotificationsRepository
implements INotificationsRepository {
  private ormRepository: MongoRepository<Notification>;

  constructor() {
    this.ormRepository = getMongoRepository(Notification, 'mongo');
  }

  //Método que vai criar e salvar uma notificação no MongoBD:
  public async create({ content, recipient_id }: ICreateNotificationDTO): Promise<Notification> {
    //Criando:
    const notification = this.ormRepository.create({ content, recipient_id });

    //Salvando no BD:
    await this.ormRepository.save(notification);

    return notification;
  }
}

export default NotificationsRepository;

 /* getMongoRepository(Entidade, NomeDaConexão)
  -> Sempre que formos utilizar em nossa aplicação uma configuração de BD que
  não é a padrão (nesse caso o postegreSQL) vamos precisar passar o nome da outra
  conexão que nesse caso é o mongo (definido no ormconfig.json). Com isso sempre
  que o repositorio nesse caso for fazer algo no banco ele irá usar a conexão do mongo
  ao invés da conexão do postegre
  */
