import User from '../models/User';

class UserController {
  async index(req, res) {
    const response = await User.findAll();
    return res.json(response);
  }

  async store(req, res) {
    console.log('Inserção de material: ', req.body);
    const response = await User.create(req.body);
    console.log('RESULTADO: ', response);
   // return res.json(response);
    
    
    const users = await User.findAll();
    let check = false;
    users.forEach(item => {
      if (item.USER_LOGIN === req.body.USER_LOGIN ) {
        const msg = 'Já existe um usuario cadastrado com o login informado.'
        check = true;
        return res.render('layouts/LayoutDialog', {
          title: msg,
          type: 0,
          resposta: 'Erro ao cadastrar o usuario (usuario ja existente)',
        });
      }
    });
    
    
    
    
    
    
    
  }

  async update(req, res) {
    const { USER_ID } = req.body; //  const { id } = req.body; === cons id = req.body.id
    const userExists = await User.findByPk(USER_ID);

    if (!userExists) {
      res.status(400).json('User não existe');
    }

    const response = await userExists.update(req.body);

    return res.json(response);
  }

  async destroy(req, res) {
    const { USER_ID } = req.body;

    const userExists = await User.findByPk(USER_ID);

    if (!userExists) {
      res.status(400).json('User não existe');
    }

    const response = await userExists.destroy();

    return res.json(response);
  }
}

export default new UserController();
