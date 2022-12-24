import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { ToastrService } from 'ngx-toastr';
import { HomeService } from 'src/app/services/home.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {
  currentLang: any;
  currentLanguage: any;
  loading!:boolean;
  actionLoading!:boolean;
  separateDialCode = false;
	SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
	preferredCountries: CountryISO[] = [this.CountryISO.UnitedStates, CountryISO.UnitedKingdom];

  constructor(
    private _TranslateService:TranslateService,
    private _Title:Title,
    private _HomeService:HomeService,
    private _Renderer2:Renderer2,
    private _ToastrService:ToastrService

  ) { }
  changePreferredCountries() {
		this.preferredCountries = [CountryISO.India, CountryISO.Canada];
	}
  ngOnInit(): void {
    this.translateFunction();
    this.loader()
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
  onChangePhone(event:any){
    var char = String.fromCharCode(event.which);
    if(!(/[0-9]/.test(char))){
        event.preventDefault();
    }
    window.addEventListener("keydown", function(e) {
      if(["ArrowUp","ArrowDown"].indexOf(e.code) > -1) {
          e.preventDefault();
      }
    }, false);
  }
  contactForm: FormGroup = new FormGroup({
    'name': new FormControl('', [Validators.required, Validators.minLength(3) ,Validators.pattern(/^([^0-9]*)$/)]),
    'email': new FormControl('', [Validators.required, Validators.email , Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]),
    'phone': new FormControl('', [Validators.required]),
    'request_type': new FormControl('', [Validators.required]),
    'message': new FormControl('', [Validators.required]),
  })
  contact(contactForm: FormGroup){
    this.actionLoading = true
    this._HomeService.submitInquiry(
      contactForm.value.name,
      contactForm.value.phone.number,
      contactForm.value.email,
      contactForm.value.request_type,
      contactForm.value.message

    ).subscribe(
      (response) => {
        if(response.success){
          this.actionLoading = false

          if (this.currentLanguage == 'ar') {
            this._ToastrService.success(
              `${response.ar_success}`,
              'سنتصل بك في اقرب وقت',
              {
                timeOut: 4000 , positionClass: 'toast-bottom-center'

              }
            )
          }else{
            this._ToastrService.success(
              `${response.success}`,
              'We will get in touch with you soon',
              {
                timeOut: 4000 , positionClass: 'toast-bottom-center'
              }
              )

          }
          contactForm.reset()
        }
      }
    )
  }
  translateFunction(){
    this.currentLanguage = localStorage.getItem("currentLanguage") || 'ar'
    this._TranslateService.use(this.currentLanguage)
    if (this.currentLanguage == 'en') {
      this._Title.setTitle(`${environment.title}Contact us`)
    }else if(this.currentLanguage == 'ar'){
      this._Title.setTitle(`${environment.title}تواصل معنا`)

    }
    this._TranslateService.onLangChange.subscribe(
      (language:any) => {
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
