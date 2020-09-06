import IParseMailTemplateDTO from "../../MailTemplateProvider/dtos/IParseMailTemplateDTO";

interface IMailContact {
  name: string;
  email: string;
}

//Interface que estabelece as informações necessárias para o envio de um e-mail
export default interface ISendMailDTO {
  to: IMailContact;
  from?: IMailContact;
  subject: string;
  templateData: IParseMailTemplateDTO;
}
