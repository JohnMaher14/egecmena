import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HomeService } from 'src/app/services/home.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
	separateDialCode = false;
	SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  currentLang: any;
  currentLanguage: any;
  constructor(
    private _TranslateService:TranslateService,
    private _Title:Title,
    private _AuthenticationService:AuthenticationService,
    private _Router:Router
  ) {
    if (sessionStorage.getItem('currentUserToken') !== null) {
      this._Router.navigate(['/'])
    }
   }

  ngOnInit(): void {
    this.translateFunction()
    console.log(this.registerForm.controls['phone']);
  }
  changePreferredCountries() {
		this.preferredCountries = [CountryISO.India, CountryISO.Canada];
	}
  registerForm: FormGroup = new FormGroup({
    'name': new FormControl('', Validators.required),
    'email': new FormControl('', [Validators.required, Validators.email]),
    'phone': new FormControl('', Validators.required),
    'password': new FormControl('', [Validators.required]),
    'password_confirmation': new FormControl('', [Validators.required]),
    'source': new FormControl('موقع الكتروني'),
    'degree_needed': new FormControl('bachelor'),
  })
  onRegister(
    registerForm: FormGroup
    ){
    console.log(

      registerForm.value.phone.number,
      registerForm.value


    );
    this._AuthenticationService.register(
      registerForm.value.name,
      registerForm.value.phone.number,
      registerForm.value.email,
      registerForm.value.password,
      registerForm.value.password_confirmation,
      registerForm.value.source,
      registerForm.value.degree_needed
      ).subscribe(
      (response) => {
        if(response.message){
          if(this.currentLanguage === 'ar'){

            Swal.fire(
              `${response.ar_message}`,
              ``,
              'success'
            )
          }
          else{
            Swal.fire(
              `${response.ar_message}`,
              ``,
              'success'
            )
          }
        }
      }, error => {
        console.log(error);
        console.log(error.error.errors.email);
        if(error.error){
          if(this.currentLanguage === 'ar'){
            Swal.fire(
              `البريد الإلكتروني تم أخذه.`,
              'حاول مجددا',
              'error'
              )
          }else{

            Swal.fire(
              `${error.error.errors.email[0]}`,
              'Please try again',
              'error'
              )
            }
        }
      }
    )
  }
  translateFunction(){
    this.currentLanguage = localStorage.getItem("currentLanguage") || 'ar'
    this._TranslateService.use(this.currentLanguage)
    this._TranslateService.onLangChange.subscribe(
      (language: any) => {
        if (language.lang == 'en') {
          this._Title.setTitle(`${environment.title}Contact us`)
        }else if(language.lang == 'ar'){
          this._Title.setTitle(`${environment.title}تواصل معنا`)

        }
        this.currentLanguage = this._TranslateService.currentLang
      }
    )
  }

}
