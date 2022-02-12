import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlsService {
  public get apiUrl() {
    return 'http://localhost:8000/api/';   //
  }
  constructor() { }
}
