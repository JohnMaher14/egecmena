import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-personal-information',
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.scss'],
})
export class PersonalInformationComponent implements OnInit {
  currentLanguage: any;
  userArray: any;
  userPersonalInfo: any;
  userAcademicInfo: any;
  isLogined!: boolean;
  actionLoading!:boolean;
  loading!:boolean;
  redirectMessage!: boolean;
  constructor(
    private _TranslateService: TranslateService,
    private _Title: Title,
    private _Router: Router,
    private _AuthenticationService: AuthenticationService,
    private _ToastrService:ToastrService,
    
    private _Renderer2:Renderer2 
  ) {}
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
    this.translateFunction();
    this.authenticationData();
    this.showPersonalInformation();
    this.loader();
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
  personalInforrmation: FormGroup = new FormGroup({
    'full_name': new FormControl('', Validators.required),
    'nation': new FormControl('', Validators.required),
    'nationality': new FormControl('', Validators.required),
    'address': new FormControl('', Validators.required),
    'area': new FormControl('', Validators.required),
    'birthdate': new FormControl('', Validators.required),
    'gender': new FormControl('', Validators.required),
    'degree_needed': new FormControl('', Validators.required),
    'user_id': new FormControl(''),
  });
  onSubmitPersonalInforrmation(personalInforrmation: FormGroup) {
    console.log(personalInforrmation.value);
    this.actionLoading = true;
    this._AuthenticationService
      .savePersonalInformation(personalInforrmation.value)
      .subscribe((response) => {
        console.log(response);
        if(response.error === 'Something went wrong, please try again later!'){
          if (this.currentLanguage === 'ar') {

            this._ToastrService.error(`${response.ar_error}`,`هناك شئ خاطئ، يرجى المحاولة فى وقت لاحق!` , {
              timeOut: 4000 , positionClass: 'toast-bottom-left'

            })

          } else {

            this._ToastrService.error(`${response.error}`,`Something went wrong, please try again later!` , {
              timeOut: 4000 , positionClass: 'toast-bottom-left'

            })
          
          }
          this._TranslateService.onLangChange.subscribe(
            (language) =>{
              if (language.lang === 'ar') {

                this._ToastrService.error(`${response.ar_error}`,`هناك شئ خاطئ، يرجى المحاولة فى وقت لاحق!` , {
                  timeOut: 4000 , positionClass: 'toast-bottom-left'
    
                })
    
              } else if(language.lang === 'en') {
    
                this._ToastrService.error(`${response.error}`,`Something went wrong, please try again later!` , {
                  timeOut: 4000 , positionClass: 'toast-bottom-left'
    
                })
              
              }
            }
          )
          this.actionLoading = false;

        }
        if(response.success){
          if (this.currentLanguage === 'ar') {

            this._ToastrService.success(`${response.ar_success}`,`لقد تم حفظ بياناتك الشخصية` , {
              timeOut: 4000 , positionClass: 'toast-bottom-left'

            })
            setTimeout(() => {
              Swal.close()

              this._Router.navigate(['/academic-information'])
            }, 1000);
          } else {

            this._ToastrService.success(`${response.ar_success}`,`Your personal information had saved` , {
              timeOut: 4000 , positionClass: 'toast-bottom-left'

            })
            // setTimeout(() => {
            //   Swal.close()
            //   this._Router.navigate(['/academic-information'])
            // }, 1000);
          }
          this.actionLoading = false;

        }
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
        this.loading = false;
      });
    }
  }

  translateFunction() {
    this.currentLanguage = localStorage.getItem('currentLanguage') || 'ar';
    this._TranslateService.use(this.currentLanguage);
    if (this.currentLanguage == 'en') {
      this._Title.setTitle(`${environment.title}Personal Information`);
    } else if (this.currentLanguage == 'ar') {
      this._Title.setTitle(`${environment.title}المعلومات الشخصية`);
    }
    this._TranslateService.onLangChange.subscribe(() => {
      this.currentLanguage = this._TranslateService.currentLang;
    });
  }
}
