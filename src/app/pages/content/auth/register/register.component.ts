import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';

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
  actionLoading!:boolean;
  constructor(
    private _TranslateService:TranslateService,
    private _Title:Title,
    private _Router:Router,
    private _ToastrService:ToastrService,
    private _Renderer2:Renderer2,
    private _UserService:UserService
  ) {
    if (localStorage.getItem('currentUserToken') !== null) {
      this._Router.navigate(['/'])
    }
  }
  loader(){
    let body = document.querySelector('body');
    this._Renderer2.setStyle(body, 'overflow' , 'hidden')
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      this._Renderer2.removeStyle(body, 'overflow')

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
    'first_name': new FormControl('', [Validators.required , Validators.minLength(3) , Validators.pattern(/^([^0-9]*)$/)]),
    'last_name': new FormControl('', [Validators.required , Validators.minLength(3) , Validators.pattern(/^([^0-9]*)$/)]),
    'email': new FormControl('', [Validators.required, Validators.email , Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]),
    'phone': new FormControl('', Validators.required),
    'password': new FormControl('', [Validators.required , Validators.minLength(6)]),
    'password_confirmation': new FormControl('', [Validators.required]),
    'source': new FormControl('موقع الكتروني'),
    'degree_needed': new FormControl('' , Validators.required),
  })
  onRegister(

    registerForm: FormGroup
    ){
      this.actionLoading = true;

    this._UserService.register(
      `${registerForm.value.first_name} ` + `${registerForm.value.last_name}`,
      registerForm.value.phone.number,
      registerForm.value.email,
      registerForm.value.password,
      registerForm.value.password_confirmation,
      registerForm.value.source,
      registerForm.value.degree_needed
      ).subscribe(
      (response) => {
        if(response.message){
          this.registerForm.reset()
          if(this.currentLanguage === 'ar'){
            this._ToastrService.success(`${response.ar_message}` , 'تسجيل صحيح' , {
              timeOut: 6000 , positionClass: 'toast-bottom-center'
            })

          }
          else{
            this._ToastrService.success(`${response.message}` , 'You register successfully' , {
              timeOut: 6000 , positionClass: 'toast-bottom-center'
            })
          }
          this._TranslateService.onLangChange.subscribe(
            (language:any) => {
              if(language.lang === 'ar'){
                this._ToastrService.success(`${response.ar_message}` , 'تسجيل صحيح' , {
                  timeOut: 6000 , positionClass: 'toast-bottom-center'
                })

              }
              else{
                this._ToastrService.success(`${response.message}` , 'You register successfully' , {
                  timeOut: 6000 , positionClass: 'toast-bottom-center'
                })
              }
            }

          )
          this.actionLoading = false;
          setTimeout(() => {
            this._Router.navigate(['/login'])
          }, 4000);
        }
      }, error => {
        this.actionLoading = true;

        if(error.error.errors.email){
          if(this.currentLanguage === 'ar'){

              this._ToastrService.error(`البريد الإلكتروني تم أخذه.` , 'حاول مجددا' , {
                timeOut: 6000 , positionClass: 'toast-bottom-center'
              })
          }else{


              this._ToastrService.error(`${error.error.errors.email[0]}` , 'Please try again' , {
                timeOut: 6000 , positionClass: 'toast-bottom-center'
              })
            }
            this._TranslateService.onLangChange.subscribe(
            (language) => {
              if(language.lang === 'ar'){

                this._ToastrService.error(`البريد الإلكتروني تم أخذه.` , 'حاول مجددا' , {
                  timeOut: 6000 , positionClass: 'toast-bottom-center'
                })
            }else{


                this._ToastrService.error(`${error.error.errors.email[0]}` , 'Please try again' , {
                  timeOut: 6000 , positionClass: 'toast-bottom-center'
                })
              }
            }

            )
            this.actionLoading = false

        }else if(error.error.errors.password){
          if(this.currentLanguage === 'ar'){

              this._ToastrService.error(`كلمة السر لا تشبه تأكيد كلمة السر` , 'حاول مجددا' , {
                timeOut: 6000 , positionClass: 'toast-bottom-center'
              })
          }else{



              this._ToastrService.error(`${error.error.errors.password[0]}` , 'Please try again' , {
                timeOut: 6000 , positionClass: 'toast-bottom-center'
              })
            }
            this._TranslateService.onLangChange.subscribe(
            (language) => {
              if(language.lang === 'ar'){

                this._ToastrService.error(`كلمة السر لا تشبه تأكيد كلمة السر` , 'حاول مجددا' , {
                  timeOut: 6000 , positionClass: 'toast-bottom-center'
                })
            }else{



                this._ToastrService.error(`${error.error.errors.password[0]}` , 'Please try again' , {
                  timeOut: 6000 , positionClass: 'toast-bottom-center'
                })
              }
            }

            )
            this.actionLoading = false

        }
      }
    )
  }
  translateFunction(){
    this.currentLanguage = localStorage.getItem("currentLanguage") || 'ar'
    this._TranslateService.use(this.currentLanguage)
    if (this.currentLanguage == 'en') {
      this._Title.setTitle(`${environment.title}Register`)
    }else if(this.currentLanguage == 'ar'){
      this._Title.setTitle(`${environment.title}انشاء حساب`)

    }
    this._TranslateService.onLangChange.subscribe(
      (language: any) => {
        if (language.lang == 'en') {
          this._Title.setTitle(`${environment.title}Register`)
        }else if(language.lang == 'ar'){
          this._Title.setTitle(`${environment.title}انشاء حساب`)

        }
        this.currentLanguage = this._TranslateService.currentLang
      }
    )
  }

}
