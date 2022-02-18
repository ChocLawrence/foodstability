import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlsService {
  public apiUrl() {

    let url = location.href;
    let returnUrl = "";

    if (url.includes("localhost")) {
      returnUrl = "http://localhost:8000/api/";
    } else if (url.includes("foodstability.com")) {
      returnUrl = "https://foodstability-api-cby54.ondigitalocean.app/api/";
    } else {
      returnUrl = "http://localhost:8000/api/";
    }

    return returnUrl;
  }

  public apiStorageUrl() {
    
    let url = location.href;
    let returnUrl = "";

    if (url.includes("localhost")) {
      returnUrl = "http://localhost:8000/storage/";
    } else if (url.includes("foodstability.com")) {
      returnUrl = "https://foodstability-api-cby54.ondigitalocean.app/storage/";
    } else {
      returnUrl = "http://localhost:8000/storage/";
    }

    console.log('>>apiStorageUrl',returnUrl);


    return returnUrl;
  }


  constructor() { }
}
