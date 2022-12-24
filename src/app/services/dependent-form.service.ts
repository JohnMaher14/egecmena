import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DependentFormService {

  constructor(
    private _HttpClient:HttpClient
  ) { }

  getUniversities(destination_slug:string, lang:string): Observable<any>{
    return this._HttpClient.get(`${environment.apiKey}filterUniversities?slug=${destination_slug}&lang=${lang}`)
  }
  getFaculty(university_slug:string , lang:string):Observable<any>{
    return this._HttpClient.get(`${environment.apiKey}filterColleges?slug=${university_slug}&lang=${lang}`)
  }
  getMajors(university_slug:string, faculty_slug:string , lang:string):Observable<any>{
    return this._HttpClient.get(`${environment.apiKey}filterMajors?uni_slug=${university_slug}&fac_slug=${faculty_slug}&lang=${lang}`)
  }
  getDepartments(id:number , lang:string): Observable<any>{
    return this._HttpClient.get(`${environment.apiKey}filterDepartments?fac_uni_major_id=${id}&lang=${lang}`)

  }
}
