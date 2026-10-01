import { z } from 'zod';

// Lê as variáveis de ambiente e valida logo na inicialização.
// Se faltar alguma, a API nem sobe — melhor descobrir o erro agora do que depois.
const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL não foi definida'),
});

export const env = envSchema.parse(process.env);
