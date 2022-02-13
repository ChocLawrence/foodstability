import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlsService {
  public get apiUrl() {
    return 'https://foodstability-api-cby54.ondigitalocean.app/api/';   // https://foodstability.com/api
  }
  constructor() { }
}
