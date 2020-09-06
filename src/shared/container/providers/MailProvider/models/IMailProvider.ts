import ISendMailDTO from "../dtos/ISendMailDTO";

//Funcionalidades que o serviço de envio de e-mail precisará ter
export default interface IMailProvider {
  //método de envio de e-mail:
  sendMail(data: ISendMailDTO): Promise<void>;
}
