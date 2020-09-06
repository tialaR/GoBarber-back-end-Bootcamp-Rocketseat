import IMailTemplateProvider from "../models/IMailTemplateProvider";

//PROVIDER DE TEMPLATE DE E-MAIL FAKE PARA OS TESTES
class FakeTemplateMailProvider implements IMailTemplateProvider {
  public async parse(): Promise<string> {
    return 'Mail content';
  };
}

export default FakeTemplateMailProvider;
