import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlsService {
  public apiUrl() {

    let url = location.href;
    let returnUrl = "";

    //returnUrl = "http://localhost:8000/api/";
    //returnUrl = "https://api.foodstability.com/api/";
    if (url.includes("localhost")) {
      returnUrl = "http://localhost:8000/api/";
    } else if (url.includes("foodstability.com")) {
      returnUrl = "https://api.foodstability.com/api/";
    } else {
      returnUrl = "http://localhost:8000/api/";
    }

    return returnUrl;
  }


  constructor() { }
}
