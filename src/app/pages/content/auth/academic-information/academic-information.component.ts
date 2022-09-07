import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-academic-information',
  templateUrl: './academic-information.component.html',
  styleUrls: ['./academic-information.component.scss']
})
export class AcademicInformationComponent implements OnInit {

  currentLanguage: any;
  userArray: any;
  userAcademicInfo: any;
  isLogined!: boolean;
  actionLoading!:boolean;
  loading!:boolean;
  constructor(
    private _TranslateService: TranslateService,
    private _Title: Title,
    private _Router: Router,
    private _AuthenticationService: AuthenticationService,
    private _ToastrService:ToastrService
  ) {}

  ngOnInit(): void {
    this.translateFunction();
    this.authenticationData();
    this.showAcademicInformation();
  }
  authenticationData() {
    this._AuthenticationService.currentUserData.subscribe(() => {
      if (this._AuthenticationService.currentUserData.getValue() == null) {
        this.isLogined = false;
      } else {
        this.userArray = JSON.parse(
          localStorage.getItem('currentUserArray') || '{}'
        );
        this.isLogined = true;
      }
    });
  }
  academicInformationForm: FormGroup = new FormGroup({
    'degree_name': new FormControl('', Validators.required),
    'degree_year': new FormControl('', Validators.required),
    'degree_country': new FormControl('', Validators.required),
    'school_name': new FormControl('', Validators.required),
    'gpa_precentage': new FormControl('', Validators.required),
    'education_system': new FormControl('', Validators.required),
    'user_id': new FormControl(''),
  });
  onSubmitAcademicInforrmation(academicInformationForm: FormGroup) {
    this.actionLoading = true;
    console.log(academicInformationForm.value);
    this._AuthenticationService
      .saveAcademicInformation(academicInformationForm.value)
      .subscribe((response) => {
        console.log(response);
        if(response.success){
          if(this.currentLanguage === 'en'){
            this._ToastrService.success(`${response.success}`,`success`)

          }else if(this.currentLanguage === 'ar'){
            this._ToastrService.success(`${response.ar_success}`,`تسجيل صحيح`)
          }
        }
        this.actionLoading = false;

      });
  }
  showAcademicInformation() {
    this.loading = true
    this._AuthenticationService
      .getAcademicInformation(this.userArray.id)
      .subscribe((response) => {
        console.log(response);
        this.userAcademicInfo = response;
        this.loading = false;
      });
  }
  onChangeNumber(event:any){
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
  translateFunction() {
    this.currentLanguage = localStorage.getItem('currentLanguage') || 'ar';
    this._TranslateService.use(this.currentLanguage);
    if (this.currentLanguage == 'en') {
      this._Title.setTitle(`${environment.title}Academic Information`);
    } else if (this.currentLanguage == 'ar') {
      this._Title.setTitle(`${environment.title}المعلومات ألاكاديمية`);
    }
    this._TranslateService.onLangChange.subscribe(() => {

      this.currentLanguage = this._TranslateService.currentLang;
    });
  }

}
