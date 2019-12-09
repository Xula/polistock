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
    const conn = new Sequelize(databaseConfig);
    const response = await conn.query(`select mat."MATE_ID", mat."MATE_NAME", sum(mov."MOVE_QUANTITY") as TotalRetiradas, sum(lot."LOT_QUANTITY") as TotalLotes from "MATERIAL" as mat left join "LOT" as lot on mat."MATE_ID"=lot."MATE_ID" left join "MOVEMENT" as mov ON lot."LOT_ID"=mov."LOT_ID" where mov."MOVE_TYPE"=1  and "MOVE_DATE" between '${req.body.inicio}' and '${req.body.fim}' group by mat."MATE_ID"`)
    var response2 = await conn.query(`SELECT m."MATE_ID", m."MATE_NAME", sum(l."LOT_QUANTITY") as totallotes FROM "public"."LOT" as l left join "MATERIAL" as m on l."MATE_ID"=m."MATE_ID" group by m."MATE_ID"`);
    var meses = (new Date(req.body.fim).getMonth() - new Date(req.body.inicio).getMonth() + (12 * (new Date(req.body.fim).getFullYear() - new Date(req.body.inicio).getFullYear())))+1;
    console.log('meses', meses);
    console.log('response', response);
    response[0].forEach(i => {
      
      response2[0].forEach( j => {
        if(j.MATE_ID === i.MATE_ID){
          i.totallotes = j.totallotes;
        }
      })
      
      i.mediaConsumo = parseInt(i.totalretiradas)/meses;
    })
    console.log('respose After - ', response[0]);
    return res.json(response[0]);
  }

  async relatorioEntrada(req, res) {
    const conn = new Sequelize(databaseConfig);
    const response = await conn.query(`SELECT "MOVE_DATE", "MOVE_QUANTITY", "MATE_NAME" FROM "MOVEMENT" INNER JOIN "LOT" ON "MOVEMENT"."LOT_ID" = "LOT"."LOT_ID" INNER JOIN "MATERIAL" ON "LOT"."MATE_ID" = "MATERIAL"."MATE_ID" WHERE "MOVE_TYPE"=2 and "MOVE_DATE" between '${req.body.inicio}' and '${req.body.fim}'`)
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
