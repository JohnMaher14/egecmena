import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { ToastrService } from 'ngx-toastr';
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
  loading!:boolean;
  constructor(
    private _TranslateService:TranslateService,
    private _Title:Title,
    private _AuthenticationService:AuthenticationService,
    private _Router:Router,
    private _ToastrService:ToastrService
  ) {
    if (sessionStorage.getItem('currentUserToken') !== null) {
      this._Router.navigate(['/'])
    }
   }
   loader(){
    this.loading = true;
    setTimeout(() => {
      this.loading = false;

    }, 1500);
  }
  ngOnInit(): void {
    this.translateFunction()
    this.loader()
  }
  changePreferredCountries() {
		this.preferredCountries = [CountryISO.India, CountryISO.Canada];
	}
  registerForm: FormGroup = new FormGroup({
    'name': new FormControl('', Validators.required),
    'email': new FormControl('', [Validators.required, Validators.email]),
    'phone': new FormControl('', Validators.required),
    'password': new FormControl('', [Validators.required , Validators.minLength(6)]),
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
        console.log(response);
        if(response.message){
          if(this.currentLanguage === 'ar'){
            this._ToastrService.success(`${response.ar_message}` , 'تسجيل صحيح' , {
              timeOut: 4000 , positionClass: 'toast-bottom-left'
            })

          }
          else{
            this._ToastrService.success(`${response.message}` , 'تسجيل صحيح' , {
              timeOut: 4000 , positionClass: 'toast-bottom-left'
            })
          }
          setTimeout(() => {
            this._Router.navigateByUrl('/login');
          }, 4000);
        }
      }, error => {

        if(error.error.errors.email){
          if(this.currentLanguage === 'ar'){

              this._ToastrService.error(`البريد الإلكتروني تم أخذه.` , 'حاول مجددا' , {
                timeOut: 4000 , positionClass: 'toast-bottom-left'
              })
          }else{


              this._ToastrService.error(`${error.error.errors.email[0]}` , 'Please try again' , {
                timeOut: 4000 , positionClass: 'toast-bottom-left'
              })
            }
        }else if(error.error.errors.password){
          if(this.currentLanguage === 'ar'){

              this._ToastrService.error(`كلمة السر لا تشبه تأكيد كلمة السر` , 'حاول مجددا' , {
                timeOut: 4000 , positionClass: 'toast-bottom-left'
              })
          }else{



              this._ToastrService.error(`${error.error.errors.password[0]}` , 'Please try again' , {
                timeOut: 4000 , positionClass: 'toast-bottom-left'
              })
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
