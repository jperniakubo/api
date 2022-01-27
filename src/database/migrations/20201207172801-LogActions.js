'use strict';

// Don't Touch!!
const path = require('path');

const directoryOfFile = path.join(
  path.join(__dirname, '../../config/migrations.js')
);
const {tableDB, getTableDB, schemaDB} = require(directoryOfFile);

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      tableDB('logActions'),
      schemaDB(
        {
          action: {
            type: Sequelize.STRING(255),
            allowNull: false,
            default: ''
          },
          table: {
            type: Sequelize.STRING(100),
            allowNull: false,
            default: ''
          },
          rowId: {
            type: Sequelize.STRING(100),
            allowNull: false,
            default: ''
          }
        },
        {
          boAdminId: {
            type: Sequelize.INTEGER,
            references: {
              model: 'boAdmin',
              key: 'id'
            }
          }
        }
      )
    );
  },

  down: (queryInterface) => {
    return queryInterface.dropTable(getTableDB());
  }
};
