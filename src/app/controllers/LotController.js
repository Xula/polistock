import Lot from '../models/Lot';
import Material from '../models/Material';

class LotController {
  async index(req, res) {
    const response = await Lot.findAll({
      attributes: ['LOT_ID', 'LOT_QUANTITY', 'LOT_VALIDITY'],
      include: [
        {
          model: Material,
          as: 'Material',
          attributes: ['MATE_NAME', 'MATE_PACKING', 'MATE_OBSERVATION'], // Se nao passar essa linha retorna todas colunas na busca
        },
      ],
    });
    return res.json(response);
  }

  async store(req, res) {
    const response = await Lot.create(req.body);
    return res.json(response);
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
