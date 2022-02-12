import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { HttpHeaders } from "@angular/common/http";
import { UrlsService } from "../core/urls.service";
import { CoreService } from "../core/core.service";
import { timeout } from 'rxjs/operators';
import { CustomHttpParamEncoder } from "../core/custom-http-param-encoder";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/x-www-form-urlencoded"
  }),
};


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  public apiUrl: string;
  public httpOptions;
  public httpTimeout = 30 * 1000;

  constructor(
    private http: HttpClient,
    private urlService: UrlsService,
    public core: CoreService
  ) {

    this.apiUrl = `${this.urlService.apiUrl}` + 'users/';
    this.httpOptions = this.core.httpOptions;
  }


  getUsers(
  ): Promise<any> {
    let url = this.apiUrl;
    return this.core.makeRemoteRequest(url, "get", null, httpOptions);
  }


  getSingleUser(id: any
  ): Promise<any> {
    let url = this.apiUrl + id;

    return this.core.makeRemoteRequest(url, "get", null, httpOptions);
  }

  /** PUT: update a users basic data  */
  updateUser(dataObject: any, id: any): Promise<any> {
    let url = this.apiUrl + 'update';

    let params = new FormData();

    // These parameters are always passed
    if (!this.core.isEmptyOrNull(dataObject.firstname)) {
      params.append("firstname", dataObject.firstname);
    }

    if (!this.core.isEmptyOrNull(dataObject.lastname)) {
      params.append("lastname", dataObject.lastname);
    }

    if (!this.core.isEmptyOrNull(dataObject.email)) {
      params.append("email", dataObject.email);
    }

    if (!this.core.isEmptyOrNull(dataObject.gender)) {
      params.append("gender", dataObject.gender);
    }

    if (!this.core.isEmptyOrNull(dataObject.phone)) {
      params.append("phone", dataObject.phone);
    }

    if (!this.core.isEmptyOrNull(dataObject.address)) {
      params.append("address", dataObject.address);
    }

    if (!this.core.isEmptyOrNull(dataObject.file)) {
      params.append("image", dataObject.file);
    }

    return this.core.makeRemoteRequest(url, "post", params, null);
  }


  /** PUT: update a currenciess basic data  */
  updatePassword(dataObject: any): Promise<any> {
    let url = this.apiUrl + 'up-pass/';

    let params = new FormData();

    // These parameters are always passed
    if (!this.core.isEmptyOrNull(dataObject.oldpassword)) {
      params.append("oldpassword", dataObject.oldpassword);
    }

    if (!this.core.isEmptyOrNull(dataObject.password)) {
      params.append("password", dataObject.password);
    }

    return this.core.makeRemoteRequest(url, "put", params, null);
  }

  /** PUT: ban user */
  banUser(id: any): Promise<any> {
    let url = this.apiUrl + 'ban/' + id;

    return this.core.makeRemoteRequest(url, "put", null, null);
  }

  activateUser(id: any): Promise<any> {
    let url = this.apiUrl + 'activate/' + id;

    return this.core.makeRemoteRequest(url, "put", null, null);
  }

  deleteUserRequest(): Promise<any> {
    let url = this.apiUrl + 'user-del-request/';

    return this.core.makeRemoteRequest(url, "put", null, null);
  }



  /** DELETE: delete a user  */
  deleteUser(id: any): Promise<any> {
    let url = '';

    // let params = new HttpParams({ encoder: new CustomHttpParamEncoder() });

    if (!this.core.isEmptyOrNull(id)) {
      url = this.apiUrl + id;
    }

    return this.core.makeRemoteRequest(url, "delete", null, this.httpOptions);
  }

}

