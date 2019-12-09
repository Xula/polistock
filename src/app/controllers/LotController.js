import Lot from '../models/Lot';
import Material from '../models/Material';
import Movement from '../models/Movement';
import Sequelize from 'sequelize';
import databaseConfig from '../../config/database';

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
      where: {
        LOT_ACTIVE: true,
      },
    });
    return res.json(response);
  }

  async store(req, res) {
    // cria o registro do lote no banco
    Lot.create(req.body)
      .then(async response => {
        // console.log('sessao', req.session.usuario);
        // console.log('inserção do lote:', response.dataValues);

        // cria o registro do movimento daquele novo lote que foi inserido

        await Movement.create({
          MOVE_DATE: new Date(),
          MOVE_TYPE: 2,
          MOVE_QUANTITY: parseInt(response.dataValues.LOT_QUANTITY),
          LOT_ID: response.dataValues.LOT_ID,
          USER_ID: req.session.usuario ? req.session.usuario.id : 1,
        })
          .then(r => console.log('MOVIMENTO CRIADO: ', r))
          .catch(e => console.log('erro movimento:', e));

        return res.render('layouts/LayoutDialog', {
          title: 'Lote cadastrado.',
          type: 1,
          resposta: response,
        });
      })
      .catch(error => {
        // console.log(error);
        return res.render('layouts/LayoutDialog', {
          title: 'Não foi possivel cadastrar o lote.',
          type: 0,
          resposta: error,
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

  async relatorioDataVencer(req, res) {
    console.log(req.body.inicio);
    const conn = new Sequelize(databaseConfig);
    const response = await conn.query(`select "MATE_NAME", "LOT_QUANTITY", "LOT_VALIDITY", "LOT_ID" from "LOT" as l inner join "MATERIAL" as m 
        on l."MATE_ID"=m."MATE_ID" where "LOT_VALIDITY" between '${new Date().toLocaleDateString().split('/').reverse().join('-')}' and '${req.body.inicio}' and l."LOT_QUANTITY" > 0`
    );
    // console.log('a vencer: ', response);
    return res.json(response[0]);
  }
}

export default new LotController();
