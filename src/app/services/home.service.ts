import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(
    private _HttpClient:HttpClient
  ) { }
  getHomeData() : Observable<any>{
    return this._HttpClient.get(`${environment.apiKey}allData`)
  }
  getTestominals(): Observable<any>{
    return this._HttpClient.get(`${environment.apiKey}userReviews`)
  }
  getBlogs() : Observable<any>{
    return this._HttpClient.get(`${environment.apiKey}blogs`)
  }
  submitInquiry(
    name: string,
    phone: string,
    email: string,
    request_type:string,
    message: string,
  ): Observable<any>{
    let formData = new FormData();

    formData.append('name' , name);
    formData.append('phone' , phone);
    formData.append('email' , email);
    formData.append('request_type' , request_type);
    formData.append('message' , message);

    return this._HttpClient.post(`${environment.apiKey}send-feedback` , formData)
  }
  getMajorSearch(id:number) :Observable<any>{
    return this._HttpClient.get(`${environment.apiKey}filterDepartments?fac_uni_major_id=${id}`)
  }

}
