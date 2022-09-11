import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HomeService } from 'src/app/services/home.service';
import { StudyService } from 'src/app/services/study.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admission-form',
  templateUrl: './admission-form.component.html',
  styleUrls: ['./admission-form.component.scss']
})
export class AdmissionFormComponent implements OnInit {
  faculties: any[] = [];
  facultyData: any;
  facultyUniversity: any;
  universityChoice:boolean =  false;
  facultyChoice:boolean =  false;
  majorChoice:boolean =  false;
  departmentChoice:boolean =  false;
  destinations : any[] = [];
  universities: any[] = [];
  majors: any[] = [];
  departments: any[] = [];
  universityOnchangeId!:number;
  changeUniversities: any[] = [];
  changeFaculty: any[] = [];
  universityData: any;
  facultyDatas: any[] = [];
  conditions: any[] = [];
  userArray: any;
  isLogined!:boolean;
  userPersonalInfo: any;
  userAcademicInfo: any;
  universityImage:string = `${environment.imageUrl}universities/`;
  facultyImage:string = `${environment.imageUrl}faculties/`;
  destinationImage:string = `${environment.imageUrl}destinations/`;
  currentLanguage: any;
  majorId!:number;
  actionLoading!:boolean;
  constructor(
    private _StudyService:StudyService,
    private _HomeService:HomeService,
    private _Router: Router,
    private _TranslateService:TranslateService,
    private _AuthenticationService:AuthenticationService,
    private _ToastrService:ToastrService,
    private _Renderer2:Renderer2

  ) { }

  ngOnInit(): void {
    this.translateFunction();
    this.authenticationData()
    this.showPersonalInformation();
    this.showAcademicInformation();
    this.showHomeData();
  }

  navigateToAcademic(){
    this._Router.navigate(['/academic-information'])
    let admissionCard = document.querySelector('.admission__card');
    let bodyOverlay = document.querySelector('.body-overlay');

    this._Renderer2.removeClass(admissionCard ,'admission__card--opened');
    this._Renderer2.removeClass(bodyOverlay ,'opened');


  }
  navigateToPersonal(){
    this._Router.navigate(['/personal-information'])
    let admissionCard = document.querySelector('.admission__card');
    let bodyOverlay = document.querySelector('.body-overlay');

    this._Renderer2.removeClass(admissionCard ,'admission__card--opened');
    this._Renderer2.removeClass(bodyOverlay ,'opened');


  }
  navigateToLogin(){
    this._Router.navigate(['/login'])
    let admissionCard = document.querySelector('.admission__card');
    let bodyOverlay = document.querySelector('.body-overlay');

    this._Renderer2.removeClass(admissionCard ,'admission__card--opened');
    this._Renderer2.removeClass(bodyOverlay ,'opened');


  }
  openAdmissionForm(){
    let admissionCard = document.querySelector('.admission__card');
    let bodyOverlay = document.querySelector('.body-overlay');
    this._Renderer2.addClass(admissionCard ,'admission__card--opened')
    this._Renderer2.addClass(bodyOverlay ,'opened')
  }
  closeAdmissionForm(){
    let admissionCard = document.querySelector('.admission__card');
    let bodyOverlay = document.querySelector('.body-overlay');

    this._Renderer2.removeClass(admissionCard ,'admission__card--opened')
    this._Renderer2.removeClass(bodyOverlay ,'opened');
  }
  showPersonalInformation() {
    if (localStorage.getItem('currentUserToken') !== null) {

    this._AuthenticationService
      .getPersonalInformation(this.userArray.id)
      .subscribe((response) => {
        console.log(response);
        this.userPersonalInfo = response.userPersonalInfo;
      });
    }
  }
  showAcademicInformation() {
    if (localStorage.getItem('currentUserToken') !== null) {

    this._AuthenticationService
      .getAcademicInformation(this.userArray.id)
      .subscribe((response) => {
        console.log(response);
        this.userAcademicInfo = response;
      });
    }
  }
  translateFunction(){
    this.currentLanguage = localStorage.getItem("currentLanguage") || 'ar'
    this._TranslateService.use(this.currentLanguage)
    this._TranslateService.onLangChange.subscribe(
      () => {

        this.currentLanguage = this._TranslateService.currentLang
      }
    )
  }
  authenticationData(){
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
  showHomeData() {
    this._HomeService.getHomeData().subscribe((response) => {
      this.destinations = response.destinations;
      this.universities = response.university;
      this.faculties = response.faculty;
      this.facultyUniversity = response.facultyUniversity;
    });
  }
  admissionFormPage: FormGroup = new FormGroup({
    'admission_destination_id': new FormControl('', Validators.required),
    'admission_university_id': new FormControl('', Validators.required),
    'admission_fac_uni_id': new FormControl('', Validators.required),
    'admission_fac_uni_major_id': new FormControl(''),
    'admission_department_id': new FormControl('', Validators.required),
    'user_id': new FormControl('')
  })
  onSubmitAdmissionForm(admissionFormPage: FormGroup){
    this.actionLoading = true
    this._AuthenticationService.submitAdmissionInformation(
      admissionFormPage.value
    ).subscribe(
      ( response) => {
        console.log(response);
        this.actionLoading = true
        if(response.success === 'You registered before and we will call you soon'){
          if(this.currentLanguage === 'en'){
            this._ToastrService.warning(`${response.success}`,`success` , {
              timeOut: 4000 , positionClass: 'toast-bottom-left'

            })
  
            this.actionLoading = false;
            this.closeAdmissionForm();
          }else if(this.currentLanguage === 'ar'){
            this._ToastrService.warning(`${response.ar_success}`,`تسجيل صحيح` , {
              timeOut: 4000 , positionClass: 'toast-bottom-left'

            })
            this.actionLoading = false;
            this.closeAdmissionForm();
          }
          this._TranslateService.onLangChange.subscribe(
            (language) => {
              if(language.lang === 'en'){
                this._ToastrService.warning(`${response.success}`,`success` , {
                  timeOut: 4000 , positionClass: 'toast-bottom-left'

                })
      
                this.actionLoading = false;
                this.closeAdmissionForm();
              }else if(language.lang === 'ar'){
                this._ToastrService.warning(`${response.ar_success}`,`تسجيل صحيح` , {
                  timeOut: 4000 , positionClass: 'toast-bottom-left'

                })
                this.actionLoading = false;
                this.closeAdmissionForm();
              }
            }
          )
        }else{
          if(this.currentLanguage === 'en'){
            this._ToastrService.success(`${response.success}`,`success` , {
              timeOut: 4000 , positionClass: 'toast-bottom-left'

            })
  
            this.actionLoading = false;
            this.closeAdmissionForm();
          }else if(this.currentLanguage === 'ar'){
            this._ToastrService.success(`${response.ar_success}`,`تسجيل صحيح` , {
              timeOut: 4000 , positionClass: 'toast-bottom-left'

            })
            this.actionLoading = false;
            this.closeAdmissionForm();
          }
          this._TranslateService.onLangChange.subscribe(
            (language) => {
              if(language.lang === 'en'){
                this._ToastrService.success(`${response.success}`,`success` , {
                  timeOut: 4000 , positionClass: 'toast-bottom-left'

                })
      
                this.actionLoading = false;
                this.closeAdmissionForm();
              }else if(language.lang === 'ar'){
                this._ToastrService.success(`${response.ar_success}`,`تسجيل صحيح` , {
                  timeOut: 4000 , positionClass: 'toast-bottom-left'

                })
                this.actionLoading = false;
                this.closeAdmissionForm();
              }
            }
          )

        }
      }
    )
  }
  showDestination() {
    this._HomeService.getHomeData().subscribe((response) => {
      this.destinations = response.destinations;
      this.universities = response.university;
      this.faculties = response.faculty;
      this.facultyUniversity = response.facultyUniversity;
    });
  }
  onChangeDestination(event: any) {
    const universitiesArray = this.universities.filter((universities: any) => {
      console.log(universities);
      return universities.destination_id == event.target.value;
    });
    this.changeUniversities = universitiesArray;
    this.universityChoice = true;
  }
  onChangeUniversity(event: any) {
    const facultyArray = this.facultyUniversity.filter((faculty: any) => {
      return faculty.university_id == event.target.value ;
    });
    this.universityOnchangeId = event.target.value
    this.changeFaculty = facultyArray;
    this.facultyChoice = true;
  }
  onChangeFaculty(event: any) {
    const majorArray = this.facultyUniversity.filter((major: any) => {
      return major.faculty_id == event.target.value && major.university_id == this.universityOnchangeId;
    });
    this._StudyService.getFacultyData(majorArray[0].faculty_id , majorArray[0].university_id).subscribe(
      (response) => {
        this.majors = response.facultyUniversity.majors
        this.majorId = response.facultyUniversity.majors[0].pivot?.departments[0].pivot?.faculty_major_university_id;

      }
    )
    this.majorChoice = true;
  }
  onMajorSaerch(event: any){
    const departmentsArray = this.majors.filter(
      (response) => {
        return response.id == event.target.value;
      }
    )
    this.departments = departmentsArray[0].pivot?.departments;
      this.departmentChoice = true;
  }
}
