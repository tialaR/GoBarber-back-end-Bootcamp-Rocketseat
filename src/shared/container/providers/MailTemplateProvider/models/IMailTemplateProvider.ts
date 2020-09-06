import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO';

export default interface IMailTemplateProvider {
  //Esse método irá retorna o template juntamente com as variáveis em forma de string
  parse(data: IParseMailTemplateDTO): Promise<string>;
}
