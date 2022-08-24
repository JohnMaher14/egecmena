import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AboutService {

  constructor(
    private _HttpClient:HttpClient
  ) { }
  getPartners(): Observable<any>{
    return this._HttpClient.get(`${environment.apiKey}clients`)
  }
  getAboutUs(): Observable<any>{
    return this._HttpClient.get(`${environment.apiKey}about-us`)
  }
}
