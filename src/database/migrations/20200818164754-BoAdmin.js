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
      tableDB('boAdmin'),
      schemaDB(
        {
          fullName: {
            type: Sequelize.STRING
          },
          email: {
            type: Sequelize.STRING
          },
          password: {
            type: Sequelize.STRING
          },
          documentType: {
            type: Sequelize.STRING(30),
            allowNull: false,
            default: ''
          },
          document: {
            type: Sequelize.STRING(50),
            allowNull: false,
            default: ''
          },
          position: {
            type: Sequelize.STRING
          },
          profileImage: {
            type: Sequelize.STRING,
            allowNull: false,
            default: ''
          },
          phoneNumber: {
            type: Sequelize.STRING(30),
            allowNull: false,
            default: ''
          }
        },
        {
          // foreign keys
          roleAdminId: {
            type: Sequelize.INTEGER,
            references: {
              model: 'roleAdmin',
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
