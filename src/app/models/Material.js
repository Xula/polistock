import Sequelize, { Model } from 'sequelize';

class Material extends Model {
  static init(sequelize) {
    super.init(
      {
        MATE_ID: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        MATE_NAME: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        MATE_OBSERVATION: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        MATE_ACTIVE: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: false, // Incluído para não usar createdAt e updatedAt. Se for necessário me avisa pra atualizar a base
        tableName: 'MATERIAL',
      }
    );
    return this;
  }
}

export default Material;
