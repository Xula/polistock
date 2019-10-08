import Sequelize, { Model } from 'sequelize';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        USER_ID: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        USER_NAME: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        USER_LOGIN: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        USER_PASSWORD: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        USER_TYPE: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: false, // Incluído para não usar createdAt e updatedAt. Se for necessário me avisa pra atualizar a base
        tableName: 'USER',
      }
    );
    return this;
  }
}

export default User;
