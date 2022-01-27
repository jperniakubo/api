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
      tableDB('positionsPerOfficeType'),
      schemaDB(
        {},
        {
          positionId: {
            type: Sequelize.INTEGER,
            references: {
              model: 'positions',
              key: 'id'
            }
          },
          officeTypeId: {
            type: Sequelize.INTEGER,
            references: {
              model: 'officeType',
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
