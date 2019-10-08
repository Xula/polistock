import { Router } from 'express';

import MaterialController from './app/controllers/MaterialController';
import LotController from './app/controllers/LotController';
import MovementController from './app/controllers/MovementController';
import UserController from './app/controllers/UserController';

const routes = new Router();

routes.get('/', (req, res) => {
  res.json({ message: 'API WORKING' });
});

routes.get('/materiais', MaterialController.index);
routes.post('/materiais', MaterialController.store);
routes.put('/materiais', MaterialController.update);
routes.delete('/materiais', MaterialController.destroy);

routes.get('/users', UserController.index);
routes.post('/users', UserController.store);
routes.put('/users', UserController.update);
routes.delete('/users', UserController.destroy);

routes.get('/lots', LotController.index);
routes.post('/lots', LotController.store);
routes.put('/lots', LotController.update);
routes.delete('/lots', LotController.destroy);

routes.get('/movements', MovementController.index);
routes.post('/movements', MovementController.store);
routes.put('/movements', MovementController.update);
routes.delete('/movements', MovementController.destroy);

export default routes;
