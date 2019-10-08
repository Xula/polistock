import User from '../models/User';

class UserController {
  async index(req, res) {
    const response = await User.findAll();
    return res.json(response);
  }

  async store(req, res) {
    const response = await User.create(req.body);
    return res.json(response);
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
