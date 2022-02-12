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
export class EmployeesService {

  public apiUrl: string;
  public httpOptions;

  constructor(
    private http: HttpClient,
    private urlService: UrlsService,
    public core: CoreService
  ) {

    this.apiUrl = `${this.urlService.apiUrl}` + 'employees/';
    this.httpOptions = this.core.httpOptions;
  }


  getEmployees(
  ): Promise<any> {
    let url = this.apiUrl;
    return this.core.makeRemoteRequest(url, "get", null, httpOptions);
  }


  /** PUT: update a currenciess basic data  */
  addEmployee(dataObject: any): Promise<any> {
    let url = this.apiUrl + 'employees';

    let params = new FormData();

    // These parameters are always passed
    if (!this.core.isEmptyOrNull(dataObject.email)) {
      params.append("name", dataObject.email);
    }

    return this.core.makeRemoteRequest(url, "post", params, this.httpOptions);
  }




  getSingleEmployee(id: any
  ): Promise<any> {
    let url = this.apiUrl + id;

    return this.core.makeRemoteRequest(url, "get", null, httpOptions);
  }


  /** DELETE: delete a currencies  */
  deleteEmployee(id: any): Promise<any> {
    let url = '';

    // let params = new HttpParams({ encoder: new CustomHttpParamEncoder() });
    if (!this.core.isEmptyOrNull(id)) {
      url = this.apiUrl + 'employees/' + id;
    }

    return this.core.makeRemoteRequest(url, "delete", null, this.httpOptions);
  }

}
