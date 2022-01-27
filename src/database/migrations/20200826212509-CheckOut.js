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
      tableDB('checkOut'),
      schemaDB(
        {
          comment: {
            type: Sequelize.STRING,
            allowNull: false,
            default: ''
          }
        },
        {
          reservationId: {
            type: Sequelize.INTEGER,
            references: {
              model: 'reservationOffice',
              key: 'id'
            }
          },
          officeId: {
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
