import {Repository} from '../generic';
import {Building} from '../../models/Building';
import {FloorBuilding} from '../../models/FloorBuilding';

const {Op} = require('sequelize');

// export
export class BuildingRepository extends Repository {
  getBuildingsByCity = async (
    cityId: number,
    limit: number,
    offset: number
  ) => {
    const response = await this.all({
      where: {
        [Op.and]: [{status: 'active'}, {cityId}]
      },
      limit,
      offset
    });
    return response;
  };

  findBuilding = async (cityId: number, limit: number, offset: number) => {
    const response = await this.all({
      where: {
        status: 'active',
        cityId
      },
      limit,
      offset
    });
    return response;
  };

  existsAndIsActiveBuilding = async (buildingId: number) => {
    const building = await this.one({
      where: {
        id: buildingId,
        status: 'active'
      }
    });
    return building !== null;
  };

  getFloorsByBuilding = async (buildingId: number) => {
    this.setModel(FloorBuilding);
    const buildings = await this.all({
      where: {
        buildingId,
        status: 'active'
      }
    });
    this.setModel(Building);
    return buildings;
  };

  getInfoBuildingAndYourCity = async (buildingId: number) => {
    this.setModel(Building);
    const buildingInfo = await this.one({
      where: {
        id: buildingId,
        status: 'active'
      }
    });
    return buildingInfo.dataValues;
  };

  getInfoBuildingById = async (buildingId: number) => {
    this.setModel(Building);
    const buildingInfo = await this.one({
      attributes: [
        'id',
        'name',
        'description',
        'numberOfFloors',
        'status',
        'address',
        'comment',
        'lat',
        'long',
        'minReservationCreationTime',
        'minReservationCancellationTime',
        'cityId'
      ],
      where: {
        id: buildingId,
        status: 'active'
      }
    });
    //return {data: [buildingInfo.dataValues, floorBuildingId]};
    return buildingInfo.dataValues;
  };

  getBuilingNameById = async (buildingId: number) => {
    this.setModel(Building);
    const buildingInfo = await this.one({
      attributes: ['name'],
      where: {
        id: buildingId
      }
    });
    return buildingInfo.dataValues.name;
  };

  constructor() {
    super();
    this.setModel(Building);
  }
}
