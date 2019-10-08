import Sequelize, { Model } from 'sequelize';

class Lot extends Model {
  static init(sequelize) {
    super.init(
      {
        LOT_ID: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        LOT_QUANTITY: {
          type: Sequelize.DECIMAL,
          allowNull: false,
        },
        LOT_VALIDITY: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: false, // Incluído para não usar createdAt e updatedAt. Se for necessário me avisa pra atualizar a base
        tableName: 'LOT',
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Material, {
      foreignKey: 'MATE_ID',
    });
  }
}

export default Lot;
