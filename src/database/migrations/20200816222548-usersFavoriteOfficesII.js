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
      tableDB('usersFavoritesOffices'),
      schemaDB(
        {
          // ...
        },
        {
          uid: {
            type: Sequelize.STRING(100),
            references: {
              model: 'users',
              key: 'uid'
            }
          },
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
