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
      tableDB('itemsCheckIn'),
      schemaDB(
        {
          checked: {
            type: Sequelize.INTEGER,
            allowNull: false,
            default: 0
          }
        },
        {
          officeItemId: {
            type: Sequelize.INTEGER,
            references: {
              model: 'officeItems',
              key: 'id'
            }
          },
          checkInId: {
            type: Sequelize.INTEGER,
            references: {
              model: 'checkIn',
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
