import Material from '../models/Material';

class MaterialController {
  async index(req, res) {
    const response = await Material.findAll();
    return res.json(response);
  }

  async store(req, res) {
    const response = await Material.create(req.body);
    return res.json(response);
  }

  async update(req, res) {
    const { MATE_ID } = req.body; //  const { id } = req.body; === cons id = req.body.id
    const materialExists = await Material.findByPk(MATE_ID);

    if (!materialExists) {
      res.status(400).json('Material não existe');
    }

    const response = await materialExists.update(req.body);

    return res.json(response);
  }

  async destroy(req, res) {
    const { MATE_ID } = req.body;

    const materialExists = await Material.findByPk(MATE_ID);

    if (!materialExists) {
      res.status(400).json('Material não existe');
    }

    const response = await materialExists.destroy();

    return res.json(response);
  }
}

export default new MaterialController();
