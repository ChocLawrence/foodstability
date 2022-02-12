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
export class ArchivesService {
  public apiUrl: string;
  public httpOptions;

  constructor(
    private http: HttpClient,
    private urlService: UrlsService,
    public core: CoreService
  ) {
    this.apiUrl = `${this.urlService.apiUrl}` + 'archives/';
    this.httpOptions = this.core.httpOptions;
  }

  getArchives(): Promise<any> {
    let url = this.apiUrl;
    return this.core.makeRemoteRequest(url, 'get', null, httpOptions);
  }

  getArchivesByVolume(id: any): Promise<any> {
    let url = this.apiUrl + id;

    return this.core.makeRemoteRequest(url, 'get', null, httpOptions);
  }

  getArchivesByVolumeAndIssue(volume: any, issue: any): Promise<any> {
    let url = this.apiUrl + volume + '/' + issue;

    return this.core.makeRemoteRequest(url, 'get', null, httpOptions);
  }
}
