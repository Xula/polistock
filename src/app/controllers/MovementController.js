import Movement from '../models/Movement';
import Lot from '../models/Lot';
import User from '../models/User';
import Material from '../models/Material';
import Sequelize from 'sequelize';
import databaseConfig from '../../config/database'

class MovementController {
  async index(req, res) {
    const response = await Movement.findAll({
      attributes: ['MOVE_ID', 'MOVE_DATE', 'MOVE_QUANTITY'],
      include: [
        {
          model: Lot,
          as: 'lotId',
          include: [{ model: Material }],
        },
        { model: User, as: 'userId' },
      ],
    });
    return res.json(response);
  }

  async store(req, res) {
    const response = await Movement.create(req.body);
    return res.json(response);
  }

  async update(req, res) {
    const { MOVEMENT_ID } = req.body; //  const { id } = req.body; === cons id = req.body.id
    const movementExists = await Movement.findByPk(MOVEMENT_ID);

    if (!movementExists) {
      res.status(400).json('Movement não existe');
    }

    const response = await movementExists.update(req.body);

    return res.json(response);
  }

  async destroy(req, res) {
    const { MOVEMENT_ID } = req.body;

    const movementExists = await Movement.findByPk(MOVEMENT_ID);

    if (!movementExists) {
      res.status(400).json('Movement não existe');
    }

    const response = await movementExists.destroy();

    return res.json(response);
  }

  async mediasConsumo(req, res) {
    const response = []; //fazer a querry
    return res.json(response);
  }

  async relatorioEntrada(req, res) {
    const conn = new Sequelize(databaseConfig);
    const response = await conn.query(`SELECT "MOVE_DATE", "MOVE_QUANTITY", "MATE_NAME" FROM "MOVEMENT" INNER JOIN "LOT" ON "MOVEMENT"."LOT_ID" = "LOT"."LOT_ID" INNER JOIN "MATERIAL" ON "LOT"."MATE_ID" = "MATERIAL"."MATE_ID" WHERE "MOVE_TYPE"=2 and "MOVE_DATE" between '${req.body.inicio}' and '${req.body.fim}'`)
    console.log(response[0]);
    return res.json(response[0]);
  }

  async relatorioDataVencer(req, res) {
    const conn = new Sequelize(databaseConfig);
    const response = await conn.query(`SELECT "MOVE_DATE", "MOVE_QUANTITY", "MATE_NAME" FROM "MOVEMENT" INNER JOIN "LOT" ON "MOVEMENT"."LOT_ID" = "LOT"."LOT_ID" INNER JOIN "MATERIAL" ON "LOT"."MATE_ID" = "MATERIAL"."MATE_ID" WHERE  "MOVE_DATE" <= '${req.body.inicio}'`)
    console.log(response[0]);
    return res.json(response[0]);
  }
  
  async relatorioSaida(req, res) {
    const conn = new Sequelize(databaseConfig);
    const response = await conn.query(`SELECT "MOVE_DATE", "MOVE_QUANTITY", "MATE_NAME" FROM "MOVEMENT" INNER JOIN "LOT" ON "MOVEMENT"."LOT_ID" = "LOT"."LOT_ID" INNER JOIN "MATERIAL" ON "LOT"."MATE_ID" = "MATERIAL"."MATE_ID" WHERE "MOVE_TYPE"=1 and "MOVE_DATE" between '${req.body.inicio}' and '${req.body.fim}'`)
    console.log(response[0]);
    return res.json(response[0]);
  }
}

export default new MovementController();
