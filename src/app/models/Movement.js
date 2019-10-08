import Sequelize, { Model } from 'sequelize';

class Movement extends Model {
  static init(sequelize) {
    super.init(
      {
        MOVE_ID: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        MOVE_DATE: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        // type: {
        //   type: Sequelize.INTEGER,
        //   field: 'MOVE_TYPE',
        //   allowNull: false,
        // },
        MOVE_QUANTITY: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        // average: {
        //   type: Sequelize.DECIMAL,
        //   field: 'MOVE_AVERAGE',
        //   allowNull: false,
        // },
      },
      {
        sequelize,
        timestamps: false, // Incluído para não usar createdAt e updatedAt. Se for necessário me avisa pra atualizar a base
        tableName: 'MOVEMENT',
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Lot, { foreignKey: 'LOT_ID', as: 'lotId' });
    this.belongsTo(models.User, { foreignKey: 'USER_ID', as: 'userId' });
  }
}

export default Movement;
