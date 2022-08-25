import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  tokenExpirationTime:any;
  currentUserData: any = new BehaviorSubject(null);
  userDataContainer:any[]=[];
  constructor(
    private _HttpClient:HttpClient,
    private _Router:Router
  ) {
    if (sessionStorage.getItem('currentUserToken')) {
      this.saveCurrentUserToken();
    }
  }
  login(
    postData:any
  ): Observable<any>{
    return this._HttpClient.post(`${environment.apiKey}auth/signin`, postData)
  }
  register(
    name: string,
    phone: string,
    email: string,
    password:string,
    password_confirmation: string,
    source:string,
    degree_needed: string
  ): Observable<any>{
    let formData = new FormData();
    formData.append('name' , name);
    formData.append('phone' , phone);
    formData.append('email' , email);
    formData.append('password' , password);
    formData.append('password_confirmation' , password_confirmation);
    formData.append('source' , source);
    formData.append('degree_needed' , degree_needed);
    return this._HttpClient.post(`${environment.apiKey}auth/signup`, formData)
  }
  saveCurrentUserToken() {
    let encodedToken: any = sessionStorage.getItem('currentUserToken');
    this.currentUserData.next(encodedToken)

  }
  signOut(){
    this.currentUserData.next(null);
    sessionStorage.removeItem('currentUserToken');
    sessionStorage.removeItem('currentUserExpiresIn');
    sessionStorage.removeItem('currentUserArray');
    this._Router.navigate(['/']);
    if (this.tokenExpirationTime) {
      clearTimeout(this.tokenExpirationTime)
    }
    this.tokenExpirationTime= null;

  }
}
