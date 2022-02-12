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
  providedIn: "root",
})
export class AuthenticationService {
  public apiUrl: string;
  public httpOptions;

  constructor(
    private http: HttpClient,
    private urlService: UrlsService,
    public core: CoreService
  ) {

    this.apiUrl = `${this.urlService.apiUrl}`;
    this.httpOptions = this.core.httpOptions;
  }


  login(dataObject: any
  ): Promise<any> {
    let url = this.apiUrl + 'login';

    let params = new FormData();

    // These parameters are always passed
    if (!this.core.isEmptyOrNull(dataObject.email)) {
      params.append("email", dataObject.email);
    }

    if (!this.core.isEmptyOrNull(dataObject.password)) {
      params.append("password", dataObject.password);
    }

    return this.core.makeRemoteRequest(url, "post", params, httpOptions);
  }


  signup(dataObject: any
  ): Promise<any> {
    let url = this.apiUrl + 'signup';

    let params = new FormData();

    // These parameters are always passed

    if (!this.core.isEmptyOrNull(dataObject.firstname)) {
      params.append("firstname", dataObject.firstname);
    }

    if (!this.core.isEmptyOrNull(dataObject.lastname)) {
      params.append("lastname", dataObject.lastname);
    }

    if (!this.core.isEmptyOrNull(dataObject.gender)) {
      params.append("gender", dataObject.gender);
    }

    if (!this.core.isEmptyOrNull(dataObject.email)) {
      params.append("email", dataObject.email);
    }

    if (!this.core.isEmptyOrNull(dataObject.password)) {
      params.append("password", dataObject.password);
    }

    if (!this.core.isEmptyOrNull(dataObject.confirmPassword)) {
      params.append("password_confirmation", dataObject.confirmPassword);
    }

    return this.core.makeRemoteRequest(url, "post", params, httpOptions);
  }

  resetPassword(dataObject: any
  ): Promise<any> {
    let url = this.apiUrl + 'forgot-password/';

    let params = new FormData();

    // These parameters are always passed
    if (!this.core.isEmptyOrNull(dataObject.email)) {
      params.append("email", dataObject.email);
    }

    return this.core.makeRemoteRequest(url, "post", params, null);
  }

  verifyResetId(id: any
  ): Promise<any> {
    let url = this.apiUrl + 'verify-token/' + id;

    return this.core.makeRemoteRequest(url, "get", null, httpOptions);
  }

  verifyAccount(id: any
  ): Promise<any> {
    let url = this.apiUrl + 'verify-now/' + id;

    return this.core.makeRemoteRequest(url, "get", null, httpOptions);
  }

  resetPasswordNow(dataObject: any): Promise<any> {
    let url = this.apiUrl + 'reset-password';

    let params = new FormData();

    // These parameters are always passed
    if (!this.core.isEmptyOrNull(dataObject.resetPasswordToken)) {
      params.append("token", dataObject.resetPasswordToken);
    }

    if (!this.core.isEmptyOrNull(dataObject.email)) {
      params.append("email", dataObject.email);
    }

    if (!this.core.isEmptyOrNull(dataObject.password)) {
      params.append("password", dataObject.password);
    }

    if (!this.core.isEmptyOrNull(dataObject.confirmPassword)) {
      params.append("password_confirmation", dataObject.confirmPassword);
    }

    return this.core.makeRemoteRequest(url, "post", params, this.httpOptions);
  }


  /** POST: logout */

  logout(): Promise<any> {

    let url = this.apiUrl + 'logout';

    return this.core.makeRemoteRequest(url, "post", null, this.httpOptions);
  }

  onLogout() {
    localStorage.clear();
    window.location.href = "/login";
  }
}
