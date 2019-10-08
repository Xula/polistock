import Sequelize from 'sequelize';

import User from '../app/models/User';
import Material from '../app/models/Material';
import Lot from '../app/models/Lot';
import Movement from '../app/models/Movement';

import databaseConfig from '../config/database';

const models = [User, Material, Lot, Movement];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
