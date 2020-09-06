interface ITemplateVariables {
  // com isso posso passar para variables qualquer tipo de objeto:
  [key: string]: string | number;
}

export default interface IParseMailTemplateDTO {
  //Vou receber o arquivo contendo o HTML (conteúdo da template)
  file: string;
  //Vou receber variáveis para imbutir dentro dessa template
  /*variables será um objeto onde eu posso receber qualquer coisa
  por isso devo deixar o nome e o valor dessa propriedade flexível*/
  variables: ITemplateVariables;
}
