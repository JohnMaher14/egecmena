import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  tokenExpirationTime:any;
  perosnalDataArray: any;
  academicDataArray: any;
  currentUserData: any = new BehaviorSubject(null);
  userDataContainer:any[]=[];
  personalData: any = new BehaviorSubject(null)
  academicData: any = new BehaviorSubject(null)
  admissionRequestRight: any = new BehaviorSubject(null)

  constructor(
    private _Router:Router
  ) {
    if (localStorage.getItem('currentUserToken')) {
      this.saveCurrentUserToken();
    }
    if(localStorage.getItem('personal_information')){
      this.perosnalDataArray =  JSON.parse(localStorage.getItem('personal_information') || '{}')
      if(this.perosnalDataArray?.full_name != null){
        console.log("test");
        this.savaCurrentPersonalData();
      }else{
        this.academicData.next(null)

      }
    }
    if(localStorage.getItem('academic_information')){
      this.academicDataArray =  JSON.parse(localStorage.getItem('academic_information') || '{}')
      if(this.academicDataArray?.degree_name != null){
        this.saveCurrentAcademicData();
      }else{
        this.academicData.next(null)

      }
    }
  }

  saveCurrentUserToken() {
    let encodedToken: any = localStorage.getItem('currentUserToken');
    this.currentUserData.next(encodedToken)
  }
  savaCurrentPersonalData(){
    return this.personalData.next(true)
  }
  saveCurrentAcademicData(){
    return this.academicData.next(true)
  }
  signOut(){
    this.academicData.next(null)
    this.personalData.next(null)
    this.currentUserData.next(null);
    localStorage.removeItem('currentUserToken');
    localStorage.removeItem('currentUserExpiresIn');
    localStorage.removeItem('currentUserArray');
    localStorage.removeItem('personal_information');
    this._Router.navigate(['/']);
    if (this.tokenExpirationTime) {
      clearTimeout(this.tokenExpirationTime)
    }
    this.tokenExpirationTime= null;

  }
}
