import { HttpClient, HttpHeaders } from '@angular/common/http';
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
    if (localStorage.getItem('currentUserToken')) {
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
    let encodedToken: any = localStorage.getItem('currentUserToken');
    this.currentUserData.next(encodedToken)

  }

  savePersonalInformation(
    postData:any
  ):Observable<any>{
    return this._HttpClient.post(`${environment.apiKey}personal-info` , postData
    )
  }
  saveAcademicInformation(
    postData:any
  ):Observable<any>{
    return this._HttpClient.post(`${environment.apiKey}academic-info` , postData
    )
  }
  getPersonalInformation(
    id:number
  ):Observable<any>{
    return this._HttpClient.get(`${environment.apiKey}personal-info/${id}`
    )
  }
  getAcademicInformation(
    id:number
  ):Observable<any>{
    return this._HttpClient.get(`${environment.apiKey}academic-info/${id}`
    )
  }
  submitAdmissionInformation(
    PostData:any
  ):Observable<any>{
    return this._HttpClient.post(`${environment.apiKey}admission-info`,PostData)
  }

  getPaperInfo(id:number):Observable<any>{
    return this._HttpClient.get(`${environment.apiKey}paper-info/${id}`)
  }
  submitFirstPaperMovement(
    passport: File,
    secondary_certificate: File,
    birth_certificate:File,
    user_id:any
  ):Observable<any>{
    let formData = new FormData();
    formData.append('passport', passport);
    formData.append('secondary_certificate', secondary_certificate);
    formData.append('birth_certificate', birth_certificate);
    formData.append('user_id', user_id);
    return this._HttpClient.post(`${environment.apiKey}first-paper-info`, formData)
  }
  submitSecondPaperMovement(
    diploma: File,
    authorization: File,
    image:File,
    last_document:File,
    user_id:any
  ):Observable<any>{
    let formData = new FormData();
    formData.append('diploma', diploma);
    formData.append('authorization', authorization);
    formData.append('image', image);
    formData.append('last_document', last_document);
    formData.append('user_id', user_id);
    return this._HttpClient.post(`${environment.apiKey}second-paper-info`, formData)
  }
  signOut(){
    this.currentUserData.next(null);
    localStorage.removeItem('currentUserToken');
    localStorage.removeItem('currentUserExpiresIn');
    localStorage.removeItem('currentUserArray');
    this._Router.navigate(['/']);
    if (this.tokenExpirationTime) {
      clearTimeout(this.tokenExpirationTime)
    }
    this.tokenExpirationTime= null;

  }
}
