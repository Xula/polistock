import { Router } from 'express';

import MaterialController from './app/controllers/MaterialController';
import LotController from './app/controllers/LotController';
import MovementController from './app/controllers/MovementController';
import UserController from './app/controllers/UserController';
import ejs from 'ejs';
import fs from 'fs';

const routes = new Router();
const PublicPath = '/app/src/public/';

// rotas para as paginas (LOGIN)
routes.get('/', (req, res) => {
  res.render(PublicPath + 'html/Login.ejs');
});

// 
routes.get('/ListarMateriais', (req, res) => {
  
  res.render('layouts/LayoutAdmin', 
        {
            title: 'Polistock - Materiais',
            body: ejs.render(fs.readFileSync(PublicPath + '/html/Materiais.ejs', 'utf8'))
        });
  
});

routes.get('/ListarLotes', (req, res) => {
  
  res.render('layouts/LayoutAdmin', 
        {
            title: 'Polistock - Lotes',
            body: ejs.render(fs.readFileSync(PublicPath + '/html/Lotes.ejs', 'utf8'))
        });
  
});

// Database access routes
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
