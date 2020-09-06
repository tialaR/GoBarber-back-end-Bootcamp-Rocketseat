interface IMailConfig {
  driver: 'ethereal' | 'ses';

  defaults: {
    from: {
      email: string;
      name: string;
    }
  }
}

export default {
  driver: process.env.MAIL_DRIVER,

  defaults: {
    from: {
      /* E-mail padrão que vai realizar o envio dos e-mails em
          ambiente de produção para os usuários
          Esse email deve ser o e-mail que temos configurado em nosso
          e-mail adress da AWS */
      email: 'tialarocha@zohomail.com',
      name: 'Tiala Rocha da equipe GoBarber'
    }
  }
} as IMailConfig;
