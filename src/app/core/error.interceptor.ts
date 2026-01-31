/**
 * The Error Interceptor intercepts http responses from the api to check if there were any errors.
 * - 401 Unauthorized: user is logged out and redirected to login (e.g. when in console and token expired).
 * - 403 Forbidden: user is logged out and redirected to login.
 * All other errors are re-thrown to be caught by the calling service so an alert can be displayed.
 */

import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        if (err.status === 401) {
          // Unauthorized – token invalid or expired; log user out
          localStorage.clear();
          window.location.href = '/login';
          return throwError(err);
        }
        if (err.status === 403) {
          // Forbidden – log user out
          localStorage.clear();
          window.location.href = '/login';
          return throwError(err);
        }
        return throwError(err);
      })
    );
  }
}
