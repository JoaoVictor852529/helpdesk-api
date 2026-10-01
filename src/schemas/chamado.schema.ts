import { z } from 'zod';

// Os schemas do Zod definem o formato que os dados PRECISAM ter.
// Tudo que chega do cliente passa por aqui antes de encostar no banco.

export const prioridades = ['baixa', 'media', 'alta'] as const;
export const statusPossiveis = ['aberto', 'em_andamento', 'resolvido'] as const;

const textoObrigatorio = (campo: string, max: number) =>
  z
    .string({ error: `Preencha o campo ${campo}` })
    .trim()
    .min(1, `Preencha o campo ${campo}`)
    .max(max, `O campo ${campo} pode ter no máximo ${max} caracteres`);

const prioridadeValida = z.enum(prioridades, { error: 'Prioridade deve ser baixa, media ou alta' });
const statusValido = z.enum(statusPossiveis, { error: 'Status deve ser aberto, em_andamento ou resolvido' });

// POST /chamados
export const criarChamadoSchema = z.object({
  titulo: textoObrigatorio('título', 120),
  descricao: textoObrigatorio('descrição', 2000),
  solicitante: textoObrigatorio('solicitante', 100),
  local: textoObrigatorio('local', 100),
  prioridade: prioridadeValida.default('media'),
});

// PATCH /chamados/:id/status
export const atualizarStatusSchema = z.object({
  status: statusValido,
});

// GET /chamados?status=aberto
export const filtroSchema = z.object({
  status: statusValido.optional(),
});

// Parâmetro :id da URL precisa ser um UUID válido
export const idSchema = z.object({
  id: z.uuid('ID inválido'),
});

// Tipos TypeScript gerados a partir dos schemas (não precisa escrever duas vezes)
export type CriarChamadoDTO = z.infer<typeof criarChamadoSchema>;
export type Status = (typeof statusPossiveis)[number];
