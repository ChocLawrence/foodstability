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
export class PostsService {
  public apiUrl: string;
  public httpOptions;

  constructor(
    private http: HttpClient,
    private urlService: UrlsService,
    public core: CoreService
  ) {
    this.apiUrl = `${this.urlService.apiUrl()}` + 'posts/';
    this.httpOptions = this.core.httpOptions;
  }

  getPosts(dataObject: any): Promise<any> {
    let url = this.apiUrl + '?';

    if (!this.core.isEmptyOrNull(dataObject.start)) {
      url += `start_date=${encodeURIComponent(dataObject.start)}`;
    }

    if (!this.core.isEmptyOrNull(dataObject.end)) {
      url += `&end_date=${encodeURIComponent(dataObject.end)}`;
    }

    if (!this.core.isEmptyOrNull(dataObject.page_size)) {
      url += `&page_size=${encodeURIComponent(dataObject.page_size)}`;
    }

    if (!this.core.isEmptyOrNull(dataObject.user_id)) {
      url += `&user_id=${encodeURIComponent(dataObject.user_id)}`;
    }

    if (!this.core.isEmptyOrNull(dataObject.category)) {
      url += `&category=${encodeURIComponent(dataObject.category)}`;
    }

    if (!this.core.isEmptyOrNull(dataObject.keyword)) {
      url += `&keyword=${encodeURIComponent(dataObject.keyword)}`;
    }

    if (!this.core.isEmptyOrNull(dataObject.sortBy)) {
      url += `&sortBy=${encodeURIComponent(dataObject.sortBy)}`;
    }

    if (!this.core.isEmptyOrNull(dataObject.sortOrder)) {
      url += `&sortOrder=${encodeURIComponent(dataObject.sortOrder)}`;
    }

    if (!this.core.isEmptyOrNull(dataObject.page_size)) {
      url += `&page_size=${encodeURIComponent(dataObject.page_size)}`;
    }

    if (!this.core.isEmptyOrNull(dataObject.page)) {
      url += `&page=${encodeURIComponent(dataObject.page)}`;
    } else {
      url += `&page=1`;
    }

    if (dataObject.visibility == 0 || dataObject.visibility) {
      url += `&visibility=${encodeURIComponent(dataObject.visibility)}`;
    }

    return this.core.makeRemoteRequest(url, 'get', null, httpOptions);
  }

  getPostsAtUrl(urlString: any, dataObject: any): Promise<any> {
    let url = urlString;

    if (!this.core.isEmptyOrNull(dataObject.start)) {
      url += `&start_date=${encodeURIComponent(dataObject.start)}`;
    }

    if (!this.core.isEmptyOrNull(dataObject.end)) {
      url += `&end_date=${encodeURIComponent(dataObject.end)}`;
    }

    return this.core.makeRemoteRequest(url, 'get', null, httpOptions);
  }

  /** PUT: update a currenciess basic data  */
  addPost(dataObject: any): Promise<any> {
    let url = this.apiUrl;

    let params = new FormData();

    // These parameters are always passed
    if (!this.core.isEmptyOrNull(dataObject.title)) {
      params.append('title', dataObject.title);
    }

    if (!this.core.isEmptyOrNull(dataObject.doi)) {
      params.append('doi', dataObject.doi);
    }

    if (!this.core.isEmptyOrNull(dataObject.category_id)) {
      params.append('category_id', dataObject.category_id[0].id);
    }

    if (!this.core.isEmptyOrNull(dataObject.tag)) {
      params.append('tag', dataObject.tag[0].id);
    }

    if (!this.core.isEmptyOrNull(dataObject.authors)) {
      params.append('authors', dataObject.authors);
    }

    if (!this.core.isEmptyOrNull(dataObject.abstract)) {
      params.append('abstract', dataObject.abstract);
    }

    if (!this.core.isEmptyOrNull(dataObject.practical)) {
      params.append('practical', dataObject.practical);
    }

    if (!this.core.isEmptyOrNull(dataObject.keywords)) {
      params.append('keywords', dataObject.keywords);
    }

    if (!this.core.isEmptyOrNull(dataObject.volume)) {
      params.append('volume', dataObject.volume);
    }

    if (!this.core.isEmptyOrNull(dataObject.issue)) {
      params.append('issue', dataObject.issue);
    }

    if (!this.core.isEmptyOrNull(dataObject.imageFile)) {
      params.append('image', dataObject.imageFile);
    }

    if (!this.core.isEmptyOrNull(dataObject.pdfFile)) {
      params.append('pdf', dataObject.pdfFile);
    }

    return this.core.makeRemoteRequest(url, 'post', params, this.httpOptions);
  }

  getSinglePost(id: any): Promise<any> {
    let url = this.apiUrl + '' + id;

    return this.core.makeRemoteRequest(url, 'get', null, this.httpOptions);
  }

  getSinglePostBySlug(slug: any): Promise<any> {
    let url = this.apiUrl + 'slug/' + slug;

    return this.core.makeRemoteRequest(url, 'get', null, this.httpOptions);
  }

  /** PUT: update a currenciess basic data  */
  updatePost(dataObject: any, id: any): Promise<any> {
    let url = this.apiUrl + id;

    let params = new FormData();

    // These parameters are always passed
    if (!this.core.isEmptyOrNull(dataObject.title)) {
      params.append('title', dataObject.title);
    }

    if (!this.core.isEmptyOrNull(dataObject.doi)) {
      params.append('doi', dataObject.doi);
    }

    if (!this.core.isEmptyOrNull(dataObject.category_id)) {
      params.append('category_id', dataObject.category_id[0].id);
    }

    if (!this.core.isEmptyOrNull(dataObject.tag)) {
      params.append('tag', dataObject.tag[0].id);
    }

    if (!this.core.isEmptyOrNull(dataObject.authors)) {
      params.append('authors', dataObject.authors);
    }

    if (!this.core.isEmptyOrNull(dataObject.abstract)) {
      params.append('abstract', dataObject.abstract);
    }

    if (!this.core.isEmptyOrNull(dataObject.practical)) {
      params.append('practical', dataObject.practical);
    }

    if (!this.core.isEmptyOrNull(dataObject.keywords)) {
      params.append('keywords', dataObject.keywords);
    }

    if (!this.core.isEmptyOrNull(dataObject.volume)) {
      params.append('volume', dataObject.volume);
    }

    if (!this.core.isEmptyOrNull(dataObject.issue)) {
      params.append('issue', dataObject.issue);
    }

    if (!this.core.isEmptyOrNull(dataObject.imageFile)) {
      params.append('image', dataObject.imageFile);
    }

    if (!this.core.isEmptyOrNull(dataObject.pdfFile)) {
      params.append('pdf', dataObject.pdfFile);
    }

    return this.core.makeRemoteRequest(url, 'post', params, this.httpOptions);
  }

  updatePostCount(id: any): Promise<any> {
    let url = this.apiUrl + 'view/' + id;

    return this.core.makeRemoteRequest(url, 'post', null, this.httpOptions);
  }

  /** DELETE: delete a currencies  */
  deletePost(id: any): Promise<any> {
    let url = '';

    // let params = new HttpParams({ encoder: new CustomHttpParamEncoder() });
    if (!this.core.isEmptyOrNull(id)) {
      url = this.apiUrl + id;
    }

    return this.core.makeRemoteRequest(url, 'delete', null, this.httpOptions);
  }
}
