import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  currentLanguage: any;
  actionLoading!:boolean;
  loading!:boolean;
  constructor(
    private _TranslateService:TranslateService,
    private _Title:Title,
    private _Router:Router,
    private _AuthenticationService:AuthenticationService,
    private _ToastrService:ToastrService
  ) { }

  ngOnInit(): void {
    this.translateFunction();
    if (localStorage.getItem('currentUserToken') !== null) {
      this._Router.navigate(['/'])
    }
    this.loader();
  }
  loader(){
    this.loading = true;
    setTimeout(() => {
      this.loading = false;

    }, 1500);
  }
  loginForm: FormGroup = new FormGroup({
    'email': new FormControl('', [Validators.required, Validators.email]),
    'password': new FormControl('', [Validators.required]),
  })
  onLogin(loginForm: FormGroup){
    this.actionLoading = true;
    this._AuthenticationService.login(
      loginForm.value
    ).subscribe(
      (response) => {
        if(response.access_token){
          localStorage.setItem('currentUserToken', JSON.stringify(response.access_token));
          localStorage.setItem('currentUserArray', JSON.stringify(response.user));
          localStorage.setItem('currentUserExpiresIn', JSON.stringify(response.expires_in));
          // save
          this._AuthenticationService.saveCurrentUserToken();
          this._Router.navigate(['/']);

          this.actionLoading = false;
        }
        console.log(response);
      }, error => {
        console.log(error);
        if(error.status == 401){
          this._ToastrService.error(`${error.error.ar_error}` , 'خطأ' , {
            timeOut: 4000 , positionClass: 'toast-bottom-left'
          })
        }
        this.actionLoading = false;

      }
    )
  }
  translateFunction(){
    this.currentLanguage = localStorage.getItem("currentLanguage") || 'ar'
    this._TranslateService.use(this.currentLanguage)
    if (this.currentLanguage == 'en') {
      this._Title.setTitle(`${environment.title}Login`)
    }else if(this.currentLanguage == 'ar'){
      this._Title.setTitle(`${environment.title}تسجيل دخول`)

    }
    this._TranslateService.onLangChange.subscribe(
      () => {

        this.currentLanguage = this._TranslateService.currentLang
      }
    )
  }

}
