import {Request} from 'express';

export interface MulterRequest extends Request {
  body: any;
  files: any;
}

export interface ID {
  id: number;
}

export interface CRUD {
  name: string;
}
export interface CRUDImage {
  name: string;
  slug: string;
}
export interface CRUDUpdate {
  id: number;
  name: string;
}

export interface FILTER {
  filter: string;
  limit: number;
  offset: number;
  conditions?: object;
}

export interface Pagination {
  limit: number;
  offset: number;
}

export interface PaginationOfficeType {
  limit: number;
  offset: number;
  position: string;
}

export interface FilterOffice {
  date: Date;
  startTime: string;
  endTime: string;
  cityId: number;
  buildingId: number;
  officeTypeId: number;
  floorBuildingId: number;
  limit: number;
  offset: number;
}

export interface FilterOfficeByFloor {
  date: Date;
  startTime: string;
  endTime: string;
  cityId: number;
  buildingId: number;
  officeTypeId: number;
  floorBuildingId: number;
  limit: number;
  offset: number;
  uid: string;
}

export interface UsersFavoritesOffices {
  uid: string;
  limit: number;
  offset: number;
}

export interface AddOfficeToFavorites {
  uid: string;
  officeId: number;
}

export interface BoAdminLogin {
  email: string;
  password: string;
}

export interface SearchRecords {
  needle: string;
}

export interface CreateAdmin {
  fullName: string;
  password: string;
  email: string;
  position: string;
}
export interface UpdateAdmin {
  id: number;
  fullName: string;
  oldPassword: string;
  newPassword: string;
  email: string;
  position: string;
  phoneNumber: string;
}

export interface AdminState {
  id: number;
  active: number;
}

export interface SupportTicket {
  uid: string;
  message: string;
}

export interface ReservationOffice {
  date: Date;
  startTime: string;
  endTime: string;
  uid: string;
  leadReservationUid: string;
  officeId: number;
}
export interface VerifyReservationTime {
  date: Date;
  startTime: string;
  endTime: string;
  uid: string;
}

export interface ListUserReservations {
  uid: string;
  limit: number;
  offset: number;
  filterReservation: number;
  filterDate: string;
}

export interface UpdateReservation {
  reservationId: number;
  date: Date;
  startTime: string;
  endTime: string;
  leadReservationUid: string;
  officeId: number;
}

export interface MakeCheckIn {
  reservationId: number;
  comment: string;
  officeId: number;
  itemsCheckIn: string;
  amountOfPeople: number;
}

export interface MakeCheckOut {
  reservationId: number;
  comment: string;
  officeId: number;
  itemsCheckOut: string;
  amountOfPeople: number;
}

export interface ClassicSearch {
  needle: string;
}

export interface ClassicSearchUser {
  needle: string;
  officeTypeId: number;
}

export interface FilterBuilding {
  cityId: number;
  limit: number;
  offset: number;
}

export interface ListBoAdmins {
  needle: string;
  limit: number;
  offset: number;
}

export interface EditUser {
  uid: string;
  fullName: string;
  email: string;
  phone: string;
  document: string;
  position: string;
  linkedinProfile: string;
}

export interface EditUserOnlyImage {
  uid: string;
}

export interface CheckQrOffice {
  officeId: number;
  code: string;
}

export interface BoListUsers {
  needle: string;
  limit: number;
  offset: number;
}

export interface UserState {
  uid: string;
  active: number;
}

export interface UserUID {
  uid: string;
}
