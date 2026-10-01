import { pool } from '../database/pool.js';
import type { CriarChamadoDTO, Status } from '../schemas/chamado.schema.js';

/*
 * O repository é a ÚNICA parte da API que escreve SQL.
 * Os valores sempre vão como parâmetros ($1, $2...), nunca colados na string.
 * Isso impede SQL Injection, um dos ataques mais comuns em APIs.
 */

// Colunas do banco (snake_case) convertidas para o padrão do JavaScript (camelCase)
const COLUNAS = `
  id, titulo, descricao, solicitante, local, prioridade, status,
  criado_em AS "criadoEm", atualizado_em AS "atualizadoEm"
`;

export interface Chamado {
  id: string;
  titulo: string;
  descricao: string;
  solicitante: string;
  local: string;
  prioridade: 'baixa' | 'media' | 'alta';
  status: Status;
  criadoEm: Date;
  atualizadoEm: Date;
}

export async function listar(status?: Status): Promise<Chamado[]> {
  if (status) {
    const { rows } = await pool.query<Chamado>(
      `SELECT ${COLUNAS} FROM chamados WHERE status = $1 ORDER BY criado_em DESC`,
      [status]
    );
    return rows;
  }
  const { rows } = await pool.query<Chamado>(`SELECT ${COLUNAS} FROM chamados ORDER BY criado_em DESC`);
  return rows;
}

export async function buscarPorId(id: string): Promise<Chamado | null> {
  const { rows } = await pool.query<Chamado>(`SELECT ${COLUNAS} FROM chamados WHERE id = $1`, [id]);
  return rows[0] ?? null;
}

export async function criar(dados: CriarChamadoDTO): Promise<Chamado> {
  const { rows } = await pool.query<Chamado>(
    `INSERT INTO chamados (titulo, descricao, solicitante, local, prioridade)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING ${COLUNAS}`,
    [dados.titulo, dados.descricao, dados.solicitante, dados.local, dados.prioridade]
  );
  return rows[0];
}

export async function atualizarStatus(id: string, status: Status): Promise<Chamado | null> {
  const { rows } = await pool.query<Chamado>(
    `UPDATE chamados SET status = $1, atualizado_em = NOW()
     WHERE id = $2
     RETURNING ${COLUNAS}`,
    [status, id]
  );
  return rows[0] ?? null;
}

export async function excluir(id: string): Promise<boolean> {
  const { rowCount } = await pool.query('DELETE FROM chamados WHERE id = $1', [id]);
  return (rowCount ?? 0) > 0;
}
