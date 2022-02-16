import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlsService {
  public get apiUrl() {
    return 'https://foodstability-api-cby54.ondigitalocean.app/api/';   // https://foodstability-api-cby54.ondigitalocean.app/api/ http://localhost:8000/api/
  }
  constructor() { }
}
