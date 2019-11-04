import Lot from '../models/Lot';
import Material from '../models/Material';
import Movement from '../models/Movement';

class LotController {
  async index(req, res) {
    const response = await Lot.findAll({
      attributes: ['LOT_ID', 'LOT_QUANTITY', 'LOT_VALIDITY'],
      include: [
        {
          model: Material,
          as: 'Material',
          attributes: ['MATE_NAME'], // Se nao passar essa linha retorna todas colunas na busca
        },
      ],
    });
    return res.json(response);
  }

  async store(req, res) {
    
    // Movement.create(req.body)
    
    Lot.create(req.body)
      .then(response => {
        return res.render('layouts/LayoutDialog', {
          title: 'Lote cadastrado.',
          type: 1,
          resposta: response
        });
      })
      .catch(error => {
        return res.render('layouts/LayoutDialog', {
          title: 'Não foi possivel cadastrar o lote.',
          type: 0,
          resposta: error
        });
      });
    
  }

  async update(req, res) {
    const { LOT_ID } = req.body; //  const { id } = req.body; === cons id = req.body.id
    const lotExists = await Lot.findByPk(LOT_ID);

    if (!lotExists) {
      res.status(400).json('Lote não existe');
    }

    const response = await lotExists.update(req.body);

    return res.json(response);
  }

  async destroy(req, res) {
    const { LOT_ID } = req.body;

    const lotExists = await Lot.findByPk(LOT_ID);

    if (!lotExists) {
      res.status(400).json('Lote não existe');
    }

    const response = await lotExists.destroy();

    return res.json(response);
  }
}

export default new LotController();
