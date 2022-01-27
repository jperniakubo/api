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
      tableDB('office'),
      schemaDB(
        {
          name: {
            type: Sequelize.STRING
          },
          description: {
            type: Sequelize.STRING
          },
          address: {
            type: Sequelize.STRING
          },
          maxCapacity: {
            type: Sequelize.INTEGER,
            allowNull: false,
            default: 0
          },
          durationCheckIn: {
            type: Sequelize.STRING(50),
            allowNull: false,
            default: ''
          },
          durationCheckOut: {
            type: Sequelize.STRING(50),
            allowNull: false,
            default: ''
          }
        },
        {
          cityId: {
            type: Sequelize.INTEGER,
            references: {
              model: 'city',
              key: 'id'
            }
          },
          buildingId: {
            references: {
              model: 'building',
              key: 'id'
            }
          },
          officeTypeId: {
            references: {
              model: 'officeType',
              key: 'id'
            }
          },
          floorBuildingId: {
            references: {
              model: 'floorBuilding',
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
