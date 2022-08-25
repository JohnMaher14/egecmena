import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HomeService } from 'src/app/services/home.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  currentLang: any;
  currentLanguage: any;
  constructor(
    private _TranslateService:TranslateService,
    private _Title:Title,
    private _Router:Router,
    private _AuthenticationService:AuthenticationService,
    private _ToastrService:ToastrService
  ) { }

  ngOnInit(): void {
    this.translateFunction();
    this._Title.setTitle(`${environment.title}Login`);
    if (sessionStorage.getItem('currentUserToken') !== null) {
      this._Router.navigate(['/'])
    }
  }
  loginForm: FormGroup = new FormGroup({
    'email': new FormControl('', [Validators.required, Validators.email]),
    'password': new FormControl('', [Validators.required]),
  })
  onLogin(loginForm: FormGroup){
    this._AuthenticationService.login(
      loginForm.value
    ).subscribe(
      (response) => {
        if(response.access_token){
          sessionStorage.setItem('currentUserToken', JSON.stringify(response.access_token));
          sessionStorage.setItem('currentUserArray', JSON.stringify(response.user));
          sessionStorage.setItem('currentUserExpiresIn', JSON.stringify(response.expires_in));
          // save
          this._AuthenticationService.saveCurrentUserToken();
          this._Router.navigate(['/']);
        }
      }, error => {
        console.log(error);
        if(error.error){
          this._ToastrService.error(`${error.error.ar_error}` , 'خطأ' , {
            timeOut: 4000
          })
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
