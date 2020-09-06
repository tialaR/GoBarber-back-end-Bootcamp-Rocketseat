import { Column, CreateDateColumn, Entity, ObjectID, ObjectIdColumn, UpdateDateColumn } from 'typeorm';

@Entity('notifications') //Nome da tabela/schema no BD
class Notification {
  @ObjectIdColumn()
  id: ObjectID;

  //Conteúdo/texto da notificação
  @Column()
  content: string;

  //Único relacionamento que vamos armazenar
  //Se refere a quem queremos enviar a notificação
  //Vai armazenar um uuid
  @Column('uuid')
  recipient_id: string;

  //Mostra se a notificação ja foi lida pelo usuário ou não:
  @Column({ default: false })
  read: boolean;

  //Data de criação do registro:
  @CreateDateColumn()
  created_at: Date;

  //Data de atualização do registro:
  @UpdateDateColumn()
  updated_at: Date;
}

export default Notification;
