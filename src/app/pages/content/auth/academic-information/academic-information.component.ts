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
  userPersonalInfo:any;
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
    this.showPersonalInformation()
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
            this._ToastrService.success(`${response.success}`,`success` , {
              timeOut: 4000 , positionClass: 'toast-bottom-left'

            })

          }else if(this.currentLanguage === 'ar'){
            this._ToastrService.success(`${response.ar_success}`,`تسجيل صحيح` , {
              timeOut: 4000 , positionClass: 'toast-bottom-left'

            })
          }
          this._TranslateService.onLangChange.subscribe(
            (language) => {
              if(language.lang === 'en'){
                this._ToastrService.success(`${response.success}`,`success` , {
                  timeOut: 4000 , positionClass: 'toast-bottom-left'
    
                })
    
              }else if(language.lang === 'ar'){
                this._ToastrService.success(`${response.ar_success}`,`تسجيل صحيح` , {
                  timeOut: 4000 , positionClass: 'toast-bottom-left'
    
                })
              }
            }
          )
        }
        this.actionLoading = false;

      });
  }
  showPersonalInformation() {
    this.loading = true;
    if (localStorage.getItem('currentUserToken') !== null) {

    this._AuthenticationService
      .getPersonalInformation(this.userArray.id)
      .subscribe((response) => {
        console.log(response);
        this.userPersonalInfo = response.userPersonalInfo;
        if(response.userPersonalInfo?.full_name == null){
          if(this.currentLanguage === 'ar'){
            this._ToastrService.error('لابد من اكمال المعلومات الشخصية اولا' , 'معلومات غير مكتملة' , {
              timeOut: 4000 , positionClass: 'toast-bottom-left'

            })
          }else{
            this._ToastrService.error('You must complete your personal information first' , 'Un complete data' , {
              timeOut: 4000 , positionClass: 'toast-bottom-left'

            })
          }
          this._TranslateService.onLangChange.subscribe(
            (language) => {
              if(language.lang === 'ar'){
                this._ToastrService.error('لابد من اكمال المعلومات الشخصية اولا' , 'معلومات غير مكتملة' , {
                  timeOut: 4000 , positionClass: 'toast-bottom-left'
    
                })
              }else{
                this._ToastrService.error('You must complete your personal information first' , 'Un complete data' , {
                  timeOut: 4000 , positionClass: 'toast-bottom-left'
    
                })
              }
              
            }
          )
          setTimeout(() => {
            this._Router.navigate(['/personal-information'])
          }, 4000);
        }
        this.loading = false;
      });
    }
  }
  showAcademicInformation() {
    this.loading = true;
    if (localStorage.getItem('currentUserToken') !== null) {

    this._AuthenticationService
      .getAcademicInformation(this.userArray.id)
      .subscribe((response) => {
        this.userAcademicInfo = response;
        this.loading = false;
      });
    }
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
