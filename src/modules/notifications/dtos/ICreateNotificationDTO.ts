export default  interface ICreateNotificationDTO {
  //Para criar uma notificação devo enviar o conteúdo dela e quem vai receber:
  //Não faz sentido criar uma notificação já lida:
  content: string;
  recipient_id: string;
}
