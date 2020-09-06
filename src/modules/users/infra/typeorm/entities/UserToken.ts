import {
  Column,
  CreateDateColumn,
  Entity,


  Generated, PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity('user_tokens')
class UserToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Generated('uuid')
  @Column()
  token: string;

  @Column()
  user_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default UserToken;

/*
  Essa será uma forma de armazenar tokens de recuperação de senha dentro da aplicação.
  @Generated('uuid') -> Forma de gerar sempre um token único para cada recuperação de senha
  user_id: string; -> Forma de ter uma referência a qual usuário esse token pertence
*/
