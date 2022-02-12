/**
 * The Error Interceptor intercepts http responses from the api to check if there were any errors. If there is a 401 Unauthorized response
 * the user is automatically logged out of the application, all other errors are re-thrown to be caught by the calling service so an alert
 * can be displayed to the user.
 */

import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {

      if (err.status === 403) {
        // auto logout if 403 response returned from api
        document.write('<style type="text/undefined">');
        window.location.reload();
        localStorage.clear();
        window.location.href = "/login";
        //this.authenticationService.logout();
      }

      return throwError(err);
    }))
  }
}
