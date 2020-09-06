//Esse DTO vai definir qual é o formato dos dados que preciso p/ criar um appointment:
export default interface ICreateAppointmentDTO {
  provider_id: string;
  date: Date;
  user_id: string;
}
