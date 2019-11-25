import { Router } from 'express';

import MaterialController from './app/controllers/MaterialController';
import LotController from './app/controllers/LotController';
import MovementController from './app/controllers/MovementController';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import Material from './app/models/Material';
import Movement from './app/models/Movement';
import Lot from './app/models/Lot';
import ejs from 'ejs';
import fs from 'fs';

const routes = new Router();
const PublicPath = '/app/src/public/';

// rotas para as paginas (LOGIN)
routes.get('/', (req, res) => {
  res.render(__dirname + '/public/html/Login.ejs');
});

routes.get('/PainelAdmin', SessionController.guard, (req, res) => {
  res.render('layouts/LayoutAdmin', 
        {
            title: 'Polistock - Admin',
            pagetitle: 'Painel',
            body: '',
            usuario: req.session.usuario ? req.session.usuario.nome : 'Usuário'
        });
});

routes.get('/PainelSecret', SessionController.guard, (req, res) => {
  res.render('layouts/LayoutSecret', 
        {
            title: 'Polistock - Secret',
            pagetitle: 'Painel',
            body: '',
            usuario: req.session.usuario ? req.session.usuario.nome : 'Usuário'
        });
});

routes.get('/ListarMateriais', SessionController.guard, (req, res) => {
  res.render('layouts/LayoutAdmin', 
        {
            title: 'Polistock - Materiais',
            pagetitle: 'Cadastrar Materiais',
            body: ejs.render(fs.readFileSync(__dirname + '/public/html/Materiais.ejs', 'utf8')),
            usuario: req.session.usuario ? req.session.usuario.nome : 'Usuário'
        });
});

routes.get('/ListarLotes', SessionController.guard, (req, res) => {
  res.render('layouts/LayoutAdmin', 
        {
            title: 'Polistock - Lotes',
            pagetitle: 'Lotes',
            body: ejs.render(fs.readFileSync(__dirname + '/public/html/Lotes.ejs', 'utf8')),
            usuario: req.session.usuario ? req.session.usuario.nome : 'Usuário'
        });
});

routes.get('/SaidaMateriais', SessionController.guard, (req, res) => {
  res.render('layouts/LayoutAdmin', 
        {
            title: 'Polistock - Saída de Materiais',
            pagetitle: 'Saída de Materiais',
            body: ejs.render(fs.readFileSync(__dirname + '/public/html/SaidaMateriais.ejs', 'utf8')),
            usuario: req.session.usuario ? req.session.usuario.nome : 'Usuário'
        });
});

routes.get('/RelatorioMediasConsumo', SessionController.guard, (req, res) => {
  res.render('layouts/LayoutAdmin', 
        {
            title: 'Polistock - Relatório: Médias de Consumo de Materiais',
            pagetitle: 'Relatório: Médias de Consumo de Materiais',
            body: ejs.render(fs.readFileSync(__dirname + '/public/html/RelatorioMediasConsumo.ejs', 'utf8')),
            usuario: req.session.usuario ? req.session.usuario.nome : 'Usuário'
        });
});

routes.get('/RelatorioMateriaisVencer', SessionController.guard, (req, res) => {
  res.render('layouts/LayoutAdmin', 
        {
            title: 'Polistock - Relatório: Materiais a vencer',
            pagetitle: 'Relatório: Relatório: Materiais a vencer',
            body: ejs.render(fs.readFileSync(__dirname + '/public/html/RelatorioMateriaisVencer.ejs', 'utf8')),
            usuario: req.session.usuario ? req.session.usuario.nome : 'Usuário'
        });
});

routes.get('/RelatorioEntradaMateriais', SessionController.guard, (req, res) => {
  res.render('layouts/LayoutAdmin', 
        {
            title: 'Polistock - Relatório: Entrada de Materiais',
            pagetitle: 'Relatório: Entrada de Materiais',
            body: ejs.render(fs.readFileSync(__dirname + '/public/html/RelatorioEntradaMateriais.ejs', 'utf8')),
            usuario: req.session.usuario ? req.session.usuario.nome : 'Usuário'
        });
});

routes.get('/RelatorioSaidaMateriais', SessionController.guard, (req, res) => {
  res.render('layouts/LayoutAdmin', 
        {
            title: 'Polistock - Relatório: Saída de Materiais',
            pagetitle: 'Relatório: Saída de Materiais',
            body: ejs.render(fs.readFileSync(__dirname + '/public/html/RelatorioSaidaMateriais.ejs', 'utf8')),
            usuario: req.session.usuario ? req.session.usuario.nome : 'Usuário'
        });
});


// endpoints
routes.post('/DesativarMaterial', async (req, res) => {
  var material = await Material.findByPk(req.body.MATE_ID);
  // se o material não existe retorna um erro
  if(!material){
    res.json({ success: false, res: 'Material não existe!' });
  }
  // se ele existe atualiza o material com o active: false
  await material.update({ MATE_ACTIVE: false })
  .then(response => {
    res.json({ success: true, res: response });
  })
  .catch(error => {
    res.json({ success: false, res: 'Erro interno' });
  });
});

routes.post('/EditarMaterial', async (req, res) => {
  var material = await Material.findByPk(req.body.MATE_ID);
  // material nao existe
  if(!material){
    res.json({ success: false, res: 'Material não existe!' });
  }
  //atualiza o material
  await material.update(req.body)
  .then(response => {
    res.json({ success: true, res: response });
  })
  .catch(error => {
    res.json({ success: false, res: error });
  });
});

routes.post('/Retirar', async (req, res) => {
  const { LOT_ID } = req.body.LOT_ID;
  const lote = await Lot.findByPk(req.body.LOT_ID);
  console.log('loteeeeeeeeeee', lote);
  // caso o lote nao exista
  if(!lote){
    res.json({ success: false, res: 'Lote não existe!' });
  }
  // faz o calculo da nova quantidade pois o backend recebe a quantidade que vai ser retirada
  const novaQtd = lote.LOT_QUANTITY - req.body.QTD;
  console.log('nova quantidade: ', novaQtd);
  
  if(novaQtd >= 0){
    await lote.update({ LOT_QUANTITY: novaQtd })
    .then( async response => {
      console.log('atualizar o lote: ', response);
      await Movement.create({ 
        MOVE_DATE: new Date(), 
        MOVE_TYPE: 1,
        MOVE_QUANTITY: req.body.QTD,
        LOT_ID: lote.LOT_ID,
        USER_ID: (req.session.usuario === undefined ? 1 : req.session.usuario.id),
      })
      .then(response2 => {
        console.log('atualizar movimento:', response2);
        //res.json({ success: true, res: {response, response2} })
        return res.render('layouts/LayoutDialog', {
            title: 'Retirada de lote foi um sucesso.',
            type: 1,
            resposta: response,
          });
      })
      .catch(error => {
        //res.json({ sucess: false, res: 'Ocorreu algum erro ao cadastrar a movimentação' });
        return res.render('layouts/LayoutDialog', {
            title: 'Ocorreu algum erro ao cadastrar a movimentação.',
            type: 0,
            resposta: error,
          });
      })
    })
    .catch(error => {
      res.json({ success: false, res: 'Ocorreu algum erro ao retirar do lote' });
    });
  }
  else{
    res.json({ success: false, res: 'Não é possível retirar esta quantidade!' });
  }
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
routes.get('/mediasConsumo', MovementController.mediasConsumo);
routes.post('/relatorioEntrada', MovementController.relatorioEntrada);
routes.post('/relatorioDataVencer', MovementController.relatorioDataVencer);
routes.post('/relatorioSaida', MovementController.relatorioSaida);
routes.post('/movements', MovementController.store);
routes.put('/movements', MovementController.update);
routes.delete('/movements', MovementController.destroy);

routes.post('/login', SessionController.login);
routes.get('/logout', SessionController.logout);

export default routes;
