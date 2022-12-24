import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from "rxjs";
import { AdmissionFormComponent } from 'src/app/pages/shared/admission-form/admission-form.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-academic-information',
  templateUrl: './academic-information.component.html',
  styleUrls: ['./academic-information.component.scss'],
  providers:[AdmissionFormComponent]
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
    private _ToastrService:ToastrService,
    private _AdmissionFormComponent:AdmissionFormComponent,
    private _UserService:UserService,
    private _Renderer2:Renderer2

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
    this._UserService
      .saveAcademicInformation(academicInformationForm.value)
      .subscribe((response) => {
        if(response.success){
          this._AdmissionFormComponent.ngOnInit();
          this._AuthenticationService.saveCurrentAcademicData();
          if(this.currentLanguage === 'en'){
            this._ToastrService.success(`${response.success}`,`success` , {
              timeOut: 6000 , positionClass: 'toast-bottom-center'

            })

          }else if(this.currentLanguage === 'ar'){
            this._ToastrService.success(`${response.ar_success}`,`تسجيل صحيح` , {
              timeOut: 6000 , positionClass: 'toast-bottom-center'

            })
          }
          this._TranslateService.onLangChange.subscribe(
            (language) => {
              if(language.lang === 'en'){
                this._ToastrService.success(`${response.success}`,`success` , {
                  timeOut: 6000 , positionClass: 'toast-bottom-center'

                })

              }else if(language.lang === 'ar'){
                this._ToastrService.success(`${response.ar_success}`,`تسجيل صحيح` , {
                  timeOut: 6000 , positionClass: 'toast-bottom-center'

                })
              }
            }
          )
          setTimeout(() => {
            this._Router.navigate(['/login'])
          }, 2000);
        }
        this.actionLoading = false;

      });
  }
  showPersonalInformation() {
    let body = document.querySelector('body');
    this._Renderer2.setStyle(body, 'overflow' , 'hidden')
    this.loading = true;
    if (localStorage.getItem('currentUserToken') !== null) {

    this._UserService
      .getPersonalInformation(this.userArray.id)
      .subscribe((response) => {
        console.log(response);
        this.userPersonalInfo = response.userPersonalInfo;
        if(response.userPersonalInfo?.full_name == null){
          if(this.currentLanguage === 'ar'){
            this._ToastrService.error('لابد من اكمال المعلومات الشخصية اولا' , 'معلومات غير مكتملة' , {
              timeOut: 6000 , positionClass: 'toast-bottom-center'

            })
          }else{
            this._ToastrService.error('You must complete your personal information first' , 'Un complete data' , {
              timeOut: 6000 , positionClass: 'toast-bottom-center'

            })
          }
          this._TranslateService.onLangChange.subscribe(
            (language) => {
              if(language.lang === 'ar'){
                this._ToastrService.error('لابد من اكمال المعلومات الشخصية اولا' , 'معلومات غير مكتملة' , {
                  timeOut: 6000 , positionClass: 'toast-bottom-center'

                })
              }else{
                this._ToastrService.error('You must complete your personal information first' , 'Un complete data' , {
                  timeOut: 6000 , positionClass: 'toast-bottom-center'

                })
              }

            }
          )
          setTimeout(() => {
            this._Router.navigate(['/personal-information'])
          }, 4000);
        }
        this.loading = false;
        this._Renderer2.removeStyle(body, 'overflow')

      });
    }
  }
  showAcademicInformation() {
    let body = document.querySelector('body');
    this._Renderer2.setStyle(body, 'overflow' , 'hidden')
    this.loading = true;
    if (localStorage.getItem('currentUserToken') !== null) {

    this._UserService
      .getAcademicInformation(this.userArray.id)
      .subscribe((response) => {
        this.userAcademicInfo = response;
        this._Renderer2.removeStyle(body, 'overflow')
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
