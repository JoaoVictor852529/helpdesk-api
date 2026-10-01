// Erro "esperado" da aplicação, com o código HTTP que deve ser devolvido.
// Ex.: new AppError('Chamado não encontrado', 404)
export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode = 400
  ) {
    super(message);
  }
}
