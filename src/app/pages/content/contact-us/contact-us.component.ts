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
  loading!:boolean;
  constructor(
    private _TranslateService:TranslateService,
    private _Title:Title,
    private _HomeService:HomeService,

  ) { }

  ngOnInit(): void {
    this.translateFunction();
    this.loader()
  }
  loader(){
    this.loading = true;
    setTimeout(() => {
      this.loading = false;

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
    'name': new FormControl('', [Validators.required, Validators.pattern(/^([^0-9]*)$/)]),
    'email': new FormControl('', [Validators.required, Validators.email]),
    'phone': new FormControl('', [Validators.required]),
    'request_type': new FormControl('', [Validators.required]),
    'message': new FormControl('', [Validators.required]),
  })
  contact(contactForm: FormGroup){
    this._HomeService.submitInquiry(
      contactForm.value
    ).subscribe(
      (response) => {
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
    this.currentLanguage = localStorage.getItem("currentLanguage") || 'ar'
    this._TranslateService.use(this.currentLanguage)
    if (this.currentLanguage == 'en') {
      this._Title.setTitle(`${environment.title}Contact us`)
    }else if(this.currentLanguage == 'ar'){
      this._Title.setTitle(`${environment.title}تواصل معنا`)

    }
    this._TranslateService.onLangChange.subscribe(
      () => {
        this.currentLanguage = this._TranslateService.currentLang
      }
    )
  }
}
