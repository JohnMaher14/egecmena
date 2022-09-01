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
  submitInquiry(data: any): Observable<any>{
    return this._HttpClient.post(`${environment.apiKey}send-feedback` , data)
  }
  getMajorSearch(id:number) :Observable<any>{
    return this._HttpClient.get(`${environment.apiKey}filterDepartments?fac_uni_major_id=${id}`)
  }

}
