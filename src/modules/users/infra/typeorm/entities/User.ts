import { Exclude, Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import uploadConfig from '@config/upload';

@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  // Não devemos retornar a senha do usuário na requisição (segurança)
  @Column()
  @Exclude()
  password: string;

  @Column()
  avatar: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Expose({ name: 'avatar_url' })
  getAvatarUrl(): string | null {
    if (!this.avatar) {
      return null;
    }

    /* Condicional para mostrar a url referente ao avatar que se
    encontra no nosso DiskStorage ou no AmazonS3 (de acordo com o ambiente
      que estamos utilizando na aplicação) */
    switch(uploadConfig.driver) {
      case 'disk':
        //Url do servidor
        return `${process.env.APP_API_URL}/files/${this.avatar}`;
        case 's3':
          //Url do bucket (AmazonS3)
          return `https://${uploadConfig.config.aws.bucket}.s3.amazonaws.com/${this.avatar}`;
        default:
          return null;
      }
  }
}

export default User;
