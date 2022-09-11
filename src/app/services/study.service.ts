import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudyService {

  constructor(
    private _HttpClient:HttpClient
  ) { }
  getDestinations():Observable<any>{
    return this._HttpClient.get(`${environment.apiKey}destinations`)
  }
  getDestinationDetails(slug:any): Observable<any>{
    return this._HttpClient.get(`${environment.apiKey}${slug}`)

  }
  getUniversityData(id:number) :Observable<any>{
    return this._HttpClient.get(`${environment.apiKey}universityData?university_id=${id}`)
  }
  getFacultyData(
    faculty_id: number,
    university_id: number
  ):Observable<any>{
    const params =  new HttpParams().set(
      'faculty_id', faculty_id
    ).set('university_id',university_id)

    return this._HttpClient.get(`${environment.apiKey}facultyData`, {
      params: params
    })
  }
  registerUser(
    FormData: any
  ): Observable<any>{
    return this._HttpClient.post(`${environment.apiKey}admission-info`,
    FormData
    )
  }
  studyByFaculty(
    id:number
  ):Observable<any>{
    return this._HttpClient.get(`${environment.apiKey}engineering?special_id=${id}`)
  }
}
