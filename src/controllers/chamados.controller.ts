import type { Request, Response } from 'express';
import * as repo from '../repositories/chamados.repository.js';
import { AppError } from '../errors/app-error.js';
import { atualizarStatusSchema, criarChamadoSchema, filtroSchema, idSchema } from '../schemas/chamado.schema.js';

/*
 * O controller recebe a requisição, valida os dados com o Zod,
 * chama o repository e devolve a resposta com o código HTTP certo.
 * Se o Zod encontrar algo errado, ele lança um erro que o
 * middleware de erros transforma em resposta 400.
 */

// GET /chamados  (opcional: ?status=aberto)
export async function listar(req: Request, res: Response) {
  const { status } = filtroSchema.parse(req.query);
  const chamados = await repo.listar(status);
  res.json(chamados);
}

// GET /chamados/:id
export async function buscar(req: Request, res: Response) {
  const { id } = idSchema.parse(req.params);
  const chamado = await repo.buscarPorId(id);
  if (!chamado) throw new AppError('Chamado não encontrado', 404);
  res.json(chamado);
}

// POST /chamados
export async function criar(req: Request, res: Response) {
  const dados = criarChamadoSchema.parse(req.body);
  const chamado = await repo.criar(dados);
  res.status(201).json(chamado); // 201 = Created
}

// PATCH /chamados/:id/status
export async function atualizarStatus(req: Request, res: Response) {
  const { id } = idSchema.parse(req.params);
  const { status } = atualizarStatusSchema.parse(req.body);
  const chamado = await repo.atualizarStatus(id, status);
  if (!chamado) throw new AppError('Chamado não encontrado', 404);
  res.json(chamado);
}

// DELETE /chamados/:id
export async function excluir(req: Request, res: Response) {
  const { id } = idSchema.parse(req.params);
  const excluiu = await repo.excluir(id);
  if (!excluiu) throw new AppError('Chamado não encontrado', 404);
  res.status(204).send(); // 204 = deu certo, sem conteúdo para devolver
}
