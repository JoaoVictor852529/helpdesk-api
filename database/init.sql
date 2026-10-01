-- Este script cria a tabela de chamados.
-- O Docker roda ele automaticamente na PRIMEIRA vez que o banco sobe.

CREATE TABLE IF NOT EXISTS chamados (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo        TEXT        NOT NULL,
  descricao     TEXT        NOT NULL,
  solicitante   TEXT        NOT NULL,
  local         TEXT        NOT NULL,
  prioridade    TEXT        NOT NULL DEFAULT 'media'
                CHECK (prioridade IN ('baixa', 'media', 'alta')),
  status        TEXT        NOT NULL DEFAULT 'aberto'
                CHECK (status IN ('aberto', 'em_andamento', 'resolvido')),
  criado_em     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice para deixar rápido o filtro por status
CREATE INDEX IF NOT EXISTS idx_chamados_status ON chamados (status);
