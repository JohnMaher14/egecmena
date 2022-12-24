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
  getDestinationDetails(
    slug:any,
    lang: string
    ): Observable<any>{
    return this._HttpClient.get(`${environment.apiKey}destinationData?slug=${slug}&lang=${lang}`)

  }
  getMejorDepartments(
    university_id:number,
    faculty_id:number,
  ):Observable<any>{
    const params = new HttpParams().set('university_id' , university_id).set('faculty_id' , faculty_id)
    return this._HttpClient.get(`${environment.apiKey}facultyMejorsDepartment` , {
      params:params
    })
  }
  getUniversityData(
    slug:string,
    language:any
    ) :Observable<any>{
      const params = new HttpParams().set('slug',slug).set('lang',language)
    return this._HttpClient.get(`${environment.apiKey}universityData` , {params:params})
  }
  getUniversityFaculty(id:number):Observable<any>{
    return this._HttpClient.get(`${environment.apiKey}facultyOfUnivercity?university_id=${id}`)
  }
  getFacultyData(
    faculty_slug: string,
    university_slug: string,
    language:string
  ):Observable<any>{
    const params =  new HttpParams().set(
      'fac_slug', faculty_slug
    ).set('uni_slug',university_slug).set('lang',language)

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

  getFacultyAllData(id:number):Observable<any>{
    return this._HttpClient.get(`${environment.apiKey}facultyAllData?faculty_id=${id}`)
  }

  getDepartments() :Observable<any>{
    return this._HttpClient.get(`${environment.apiKey}allDataV`)
  }
}
