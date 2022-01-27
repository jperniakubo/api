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
      tableDB('itemsCheckOut'),
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
          checkOutId: {
            type: Sequelize.INTEGER,
            references: {
              model: 'checkOut',
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
