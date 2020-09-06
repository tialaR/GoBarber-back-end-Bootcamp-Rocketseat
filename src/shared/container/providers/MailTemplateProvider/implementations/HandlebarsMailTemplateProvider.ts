import fs from 'fs';
import handlebars from 'handlebars';
import IParseMailTemplateDTO from "../dtos/IParseMailTemplateDTO";
import IMailTemplateProvider from "../models/IMailTemplateProvider";

//PROVIDER QUE USA A LIB HANDLEBARS PARA CRIAR TEMPLATE DE E-MAIL
class HandlebarsMailTemplateProvider implements IMailTemplateProvider {
  public async parse({ file, variables }: IParseMailTemplateDTO): Promise<string> {

    //Usando fs do node para ler arquivo html
    const templateFileContent = await fs.promises.readFile(file, {
      encoding: 'utf-8'
    });

    const parseTemplate = handlebars.compile(templateFileContent);

    return parseTemplate(variables);
  };
}

export default HandlebarsMailTemplateProvider;
