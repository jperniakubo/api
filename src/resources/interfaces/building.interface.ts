export interface FILTERBYCITY {
  cityId: number;
  limit: number;
  offset: number;
}

export interface FILTERBYNAME {
  name: string;
  cityId: number;
  limit: number;
  offset: number;
}

export interface FloorsByBuilding {
  buildingId: number;
}
