import pg from 'pg';
import { env } from '../config/env.js';

// O "pool" mantém algumas conexões abertas com o PostgreSQL
// e reaproveita elas a cada consulta, em vez de abrir uma nova toda vez.
export const pool = new pg.Pool({ connectionString: env.DATABASE_URL });
