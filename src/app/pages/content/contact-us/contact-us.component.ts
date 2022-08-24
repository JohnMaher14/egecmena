import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { HomeService } from 'src/app/services/home.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {
  currentLang: any;
  currentLanguage: any;
  constructor(
    private _TranslateService:TranslateService,
    private _Title:Title,
    private _HomeService:HomeService,

  ) { }

  ngOnInit(): void {
    this.translateFunction()
  }
  contactForm: FormGroup = new FormGroup({
    'name': new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]),
    'email': new FormControl('', [Validators.required, Validators.email]),
    'phone': new FormControl('', [Validators.required]),
    'request_type': new FormControl('', [Validators.required]),
    'message': new FormControl('', [Validators.required]),
  })
  contact(contactForm: FormGroup){
    console.log(contactForm.value);
    this._HomeService.submitInquiry(
      contactForm.value
    ).subscribe(
      (response) => {
        console.log(response);
        if(response.success){
          if (this.currentLanguage == 'ar') {
            Swal.fire(
              `${response.ar_success}`,
              'سنتصل بك في اقرب وقت',
              'success'
            )
          }else{
            Swal.fire(
              `${response.success}`,
              'We will get in touch with you soon',
              'success'
            )

          }
          contactForm.reset()
        }
      }
    )
  }
  translateFunction(){
    this.currentLang = localStorage.getItem("currentLanguage") || 'ar'
    this._TranslateService.use(this.currentLang)
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
