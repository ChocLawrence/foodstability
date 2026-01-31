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

  /** Base URL for storage (images, PDFs). No trailing slash. */
  public apiStorageUrl(): string {
    const url = location.href;
    if (url.includes('localhost')) {
      return 'http://localhost:8000/storage/';
    }
    if (url.includes('foodstability.com')) {
      return 'https://api.foodstability.com/storage/';
    }
    return 'http://localhost:8000/storage/';
  }

  constructor() { }
}
