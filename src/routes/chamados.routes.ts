import { Router } from 'express';
import * as controller from '../controllers/chamados.controller.js';

// Liga cada URL + método HTTP a uma função do controller.
export const chamadosRoutes = Router();

chamadosRoutes.get('/', controller.listar);
chamadosRoutes.get('/:id', controller.buscar);
chamadosRoutes.post('/', controller.criar);
chamadosRoutes.patch('/:id/status', controller.atualizarStatus);
chamadosRoutes.delete('/:id', controller.excluir);
