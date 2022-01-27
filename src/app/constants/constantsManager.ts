export class ConstantsManager {
  readonly BASE_URL = 'https://apionekey.co.kworld.kpmg.com:5000/';

  constructor() {
    // ....
  }

  getBaseUrl() {
    return this.BASE_URL;
  }

  getUrlBuildingImages(): string {
    return this.BASE_URL + 'buildingImages/';
  }

  getUrlBoAdminAvatar(): string {
    return this.BASE_URL + 'boAdminImages/';
  }

  getUrlCheckInImages(): string {
    return this.BASE_URL + 'checkInImages/';
  }

  getUrlOfficeImages(): string {
    return this.BASE_URL + 'officeImages/';
  }

  getUrlOfficePlains(): string {
    return this.BASE_URL + 'officePlains/';
  }

  getUrlUserImages(): string {
    return this.BASE_URL + 'users/';
  }
}
