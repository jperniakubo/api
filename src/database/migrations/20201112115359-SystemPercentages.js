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
      tableDB('systemPercentages'),
      schemaDB(
        {
          percent: {
            type: Sequelize.STRING,
            allowNull: false,
            default: ''
          },
          percentText: {
            type: Sequelize.STRING,
            allowNull: false,
            default: ''
          }
        },
        {}
      )
    );
  },

  down: (queryInterface) => {
    return queryInterface.dropTable(getTableDB());
  }
};
