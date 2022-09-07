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
  constructor(
    private _TranslateService: TranslateService,
    private _Title: Title,
    private _Router: Router,
    private _AuthenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.translateFunction();
    this.authenticationData();
    this.showPersonalInformation();

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
            Swal.fire(
              `لقد تم حفظ بياناتك الشخصية`,
              `${response.ar_error}`,
              'error'
            );
          } else {
            Swal.fire(
              `Your personal information had saved`,
              `${response.error}`,
              'error'
            );
          }
          this.actionLoading = false;

        }
        if(response.success){
          if (this.currentLanguage === 'ar') {
            Swal.fire(
              `لقد تم حفظ بياناتك الشخصية`,
              `${response.ar_success}`,
              'success',

            );
            setTimeout(() => {
              Swal.close()

              this._Router.navigate(['/academic-information'])
            }, 1000);
          } else {
            Swal.fire(
              `Your personal information had saved`,
              `${response.success}`,
              'success'
            );
            setTimeout(() => {
              Swal.close()
              this._Router.navigate(['/academic-information'])
            }, 1000);
          }
          // localStorage.setItem('')
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
