import { MigrationInterface, QueryRunner, Table } from "typeorm";

export default class CreateUserTokens1595803293559 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(new Table({
        name: 'user_tokens',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'token',
            type: 'uuid',
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'user_id',
            type: 'uuid',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            name: 'TokenUser',
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            columnNames: ['user_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
          }
        ]
      }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable('user_tokens');
    }
}

/*
Chave estrangeira que relacionar o id com o campo do id
presente na tabela de Users:

foreignKeys: [
  {
    name: 'TokenUser',
    referencedTableName: 'users', -> Referência a tabela de Users
    referencedColumnNames: ['id'], -> Referência o campo id da tabela de Users
    columnNames: ['user_id'] -> Nessa tabela (user_tokens) a referência terá o nome de user_id
    onDelete: 'CASCADE', -> Se o usuário for deletado o token tambem será
    onUpdate: 'CASCADE' -> Se o usuário for atualizado o token tambem será
  }
]
*/
