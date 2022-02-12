import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { UrlsService } from '../core/urls.service';
import { CoreService } from '../core/core.service';
import { CustomHttpParamEncoder } from '../core/custom-http-param-encoder';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class SubmissionService {
  public apiUrl: string;
  public httpOptions;

  constructor(
    private http: HttpClient,
    private urlService: UrlsService,
    public core: CoreService
  ) {
    this.apiUrl = `${this.urlService.apiUrl}` + 'submissions/';
    this.httpOptions = this.core.httpOptions;
  }

  /** PUT: update a currenciess basic data  */
  addSubmission(dataObject: any): Promise<any> {
    let url = this.apiUrl;

    let params = new FormData();

    // These parameters are always passed
    if (!this.core.isEmptyOrNull(dataObject.full_name)) {
      params.append('full_name', dataObject.full_name);
    }

    if (!this.core.isEmptyOrNull(dataObject.email)) {
      params.append('email', dataObject.email);
    }

    if (!this.core.isEmptyOrNull(dataObject.designation)) {
      params.append('designation', dataObject.designation);
    }

    if (!this.core.isEmptyOrNull(dataObject.contact)) {
      params.append('contact', dataObject.contact);
    }

    if (!this.core.isEmptyOrNull(dataObject.specialization)) {
      params.append('specialization', dataObject.specialization);
    }

    if (!this.core.isEmptyOrNull(dataObject.uni_org)) {
      params.append('uni_org', dataObject.uni_org);
    }

    if (!this.core.isEmptyOrNull(dataObject.article_type)) {
      params.append('article_type', dataObject.article_type);
    }

    if (!this.core.isEmptyOrNull(dataObject.article_title)) {
      params.append('article_title', dataObject.article_title);
    }

    if (!this.core.isEmptyOrNull(dataObject.coverFile)) {
      params.append('cover', dataObject.coverFile);
    }

    if (!this.core.isEmptyOrNull(dataObject.manuscriptFile)) {
      params.append('manuscript', dataObject.manuscriptFile);
    }

    if (!this.core.isEmptyOrNull(dataObject.supplementaryFile)) {
      params.append('supplementary', dataObject.supplementaryFile);
    }


    return this.core.makeRemoteRequest(url, 'post', params, this.httpOptions);
  }
}
