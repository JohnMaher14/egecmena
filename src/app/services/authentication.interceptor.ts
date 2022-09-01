import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {

  constructor(
    private _AuthenticationService:AuthenticationService
    ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // define the token
    const currentUserToken = JSON.parse(localStorage.getItem('currentUserToken') || '{}');
    // if the current data is not nul then clone the authorization + Bearer token
    if (this._AuthenticationService.currentUserData.getValue() != null) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUserToken}`
        }
      });
    }
    //  if the token expired and data is error with 401 then go to signout function to handle 401 error
    return next.handle(request);
    // return next.handle(request);
  }
}
