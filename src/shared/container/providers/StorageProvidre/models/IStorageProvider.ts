//Métodos que um StorageProvider deverá conter:
//Os métodos serão responsáveis por salvar e deletar arquivos de imagem

export default interface IStorageProvider {
  saveFile(file: string): Promise<string>;
  deleteFile(file: string): Promise<void>;
}

/**
 *   saveFile(file: string): Promise<string>; -> Recebe o caminho
 *    do arquivo que quero salvar e devolve o caminho completo que
 *    esse arquivo foi salvo.
 *   deleteFile(file: string): Promise<void>; -> recebe o arquivo
 *    e somente deleta sem retornar nada.
 */
