/* Adicionando uma informação nova dentro da minha Request (default) do express
  estou dizendo que agora a minha tipagem de request do express aceita um request.user = { id: '' }
*/
declare namespace Express {
  export interface Request {
    user: {
      id: string;
    };
  }
}
