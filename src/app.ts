import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { chamadosRoutes } from './routes/chamados.routes.js';
import { errorHandler } from './middlewares/error-handler.js';
import { pool } from './database/pool.js';

export const app = express();

app.use(helmet()); // adiciona cabeçalhos HTTP de segurança
app.use(cors()); // permite que o app mobile e sites acessem a API
app.use(express.json({ limit: '100kb' })); // lê JSON do corpo, com limite de tamanho

// Rota para checar se a API e o banco estão no ar
app.get('/health', async (_req, res) => {
  await pool.query('SELECT 1');
  res.json({ status: 'ok' });
});

app.use('/chamados', chamadosRoutes);

// Rota que não existe
app.use((_req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

// O middleware de erros sempre fica por último
app.use(errorHandler);
