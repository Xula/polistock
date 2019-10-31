import Material from '../models/Material';

class MaterialController {
  async index(req, res) {
    const response = await Material.findAll();
    return res.json(response);
  }

  async store(req, res) {
    console.log('Inserção de material: ', req.body);
    //const response = await Material.create(req.body);
    //console.log('RESULTADO: ', response);
    //return res.json(response);
    
    Material.create(req.body)
      .then(response => {
        return res.render('layouts/LayoutDialog', 
        {
            title: "Material cadastrado.",
            type: 1,
            resposta: response
        });
      })
      .catch(error => {
        return res.render('layouts/LayoutDialog', 
        {
            title: "Não foi possivel cadastrar o material.",
            type: 0,
            resposta: error
        });
      });
  }

  async update(req, res) {
    /* {
      "MATE_ID": 1,
      "MATE_NAME":"dente",
      ...
  }*/
    
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
