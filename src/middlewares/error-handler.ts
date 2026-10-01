import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/app-error.js';

/*
 * Todo erro lançado nas rotas cai aqui (o Express 5 faz isso sozinho,
 * inclusive em funções async). Assim o tratamento fica num lugar só.
 */
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  // Dados inválidos enviados pelo cliente
  if (err instanceof ZodError) {
    return res.status(400).json({
      erro: 'Dados inválidos',
      detalhes: err.issues.map((i) => ({ campo: i.path.join('.'), mensagem: i.message })),
    });
  }

  // Erros previstos (ex.: chamado não encontrado)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ erro: err.message });
  }

  // JSON mal formatado no corpo da requisição
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ erro: 'JSON inválido no corpo da requisição' });
  }

  // Qualquer outra coisa: registra no terminal, mas NÃO mostra detalhes ao cliente
  // (detalhes internos ajudam um atacante a entender o sistema)
  console.error(err);
  return res.status(500).json({ erro: 'Erro interno do servidor' });
}
