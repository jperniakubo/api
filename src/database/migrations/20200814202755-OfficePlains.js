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
      tableDB('officePlains'),
      schemaDB(
        {
          image: {
            type: Sequelize.STRING,
            allowNull: false,
            default: ''
          },
          description: {
            type: Sequelize.STRING,
            allowNull: false,
            default: ''
          }
        },
        {
          officeId: {
            type: Sequelize.INTEGER,
            references: {
              model: 'office',
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
