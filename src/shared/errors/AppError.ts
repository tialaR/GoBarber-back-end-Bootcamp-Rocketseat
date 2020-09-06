// Criando a nossa própria classe de erro
class AppError {
  public readonly message: string;

  public readonly statusCode: number; // Código Http de erro

  constructor(message: string, statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
  }
}

export default AppError;
