import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-personal-information',
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.scss']
})
export class PersonalInformationComponent implements OnInit {

  currentLanguage: any;
  constructor(
    private _TranslateService:TranslateService,
    private _Title:Title,
    private _Router:Router,

  ) { }

  ngOnInit(): void {
    this.translateFunction();
    if (sessionStorage.getItem('currentUserToken') !== null) {
      // this._Router.navigate(['/ss'])
      console.log("testttt");
    }
  }
  personalInforrmation: FormGroup = new FormGroup({
    'full_name' : new FormControl('', Validators.required),
    'nation' : new FormControl('', Validators.required),
    'nationality' : new FormControl('', Validators.required),
    'address' : new FormControl('', Validators.required),
    'area' : new FormControl('', Validators.required),
    'birthdate' : new FormControl('', Validators.required),
    'gender' : new FormControl('', Validators.required),
    'degree_needed' : new FormControl('', Validators.required),
  })
  onSubmitPersonalInforrmation(personalInforrmation:FormGroup){
    console.log(personalInforrmation.value);
  }
  translateFunction(){
    this.currentLanguage = localStorage.getItem("currentLanguage") || 'ar'
    this._TranslateService.use(this.currentLanguage)
    this._TranslateService.onLangChange.subscribe(
      (language: any) => {
        if (language.lang == 'en') {
          this._Title.setTitle(`${environment.title}Personal Information`)
        }else if(language.lang == 'ar'){
          this._Title.setTitle(`${environment.title}المعلومات الشخصية`)

        }
        this.currentLanguage = this._TranslateService.currentLang
      }
    )
  }

}
