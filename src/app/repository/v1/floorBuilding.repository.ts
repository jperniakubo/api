import {Repository} from '../generic';
import {FloorBuilding} from '../../models/FloorBuilding';
// export
export class FloorBuildingRepository extends Repository {
  getIinfoFloorById = async (floorBuildingId: number) => {
    const floorBuilding = await this.one({
      where: {
        id: floorBuildingId,
        status: 'active'
      }
    });
    return floorBuilding.dataValues;
  };

  getIFloorInfoById = async (floorBuildingId: number) => {
    const floorBuilding = await this.one({
      attributes: ['id', 'floor', 'status'],
      where: {
        id: floorBuildingId,
        status: 'active'
      }
    });
    return floorBuilding.dataValues;
  };

  getFloorBuildingNameById = async (floorBuildingId: number) => {
    const floorBuilding = await this.one({
      attributes: ['floor'],
      where: {
        id: floorBuildingId
      }
    });
    return floorBuilding.dataValues.floor;
  };

  constructor() {
    super();
    this.setModel(FloorBuilding);
  }
}
