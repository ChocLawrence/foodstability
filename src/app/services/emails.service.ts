import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { HttpHeaders } from "@angular/common/http";
import { UrlsService } from "../core/urls.service";
import { CoreService } from "../core/core.service";
import { CustomHttpParamEncoder } from "../core/custom-http-param-encoder";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/x-www-form-urlencoded",
  }),
};


@Injectable({
  providedIn: 'root'
})
export class EmailsService {

  public apiUrl: string;
  public httpOptions;

  constructor(
    private http: HttpClient,
    private urlService: UrlsService,
    public core: CoreService
  ) {

    this.apiUrl = `${this.urlService.apiUrl}` + 'emails/';
    this.httpOptions = this.core.httpOptions;
  }


  verifyEmail(id: any): Promise<any> {
    let url = id;

    return this.core.makeRemoteRequest(url, "get", null, httpOptions);
  }



}
