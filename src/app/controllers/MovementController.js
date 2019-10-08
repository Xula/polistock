import Movement from '../models/Movement';
import Lot from '../models/Lot';
import User from '../models/User';
import Material from '../models/Material';

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
}

export default new MovementController();
