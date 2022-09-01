import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HomeService } from 'src/app/services/home.service';
import { StudyService } from 'src/app/services/study.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-faculty',
  templateUrl: './faculty.component.html',
  styleUrls: ['./faculty.component.scss']
})
export class FacultyComponent implements OnInit {

  faculties: any[] = [];
  facultyData: any;
  facultyUniversity: any;
  destinations : any[] = [];
  universityData: any;
  facultyDatas: any[] = [];
  conditions: any[] = [];
  userArray: any;
  destinationDetail: any;
  isLogined!:boolean;
  userPersonalInfo: any;
  userAcademicInfo: any;
  universityImage:string = `${environment.imageUrl}universities/`;
  facultyImage:string = `${environment.imageUrl}faculties/`;
  destinationImage:string = `${environment.imageUrl}destinations/`;
  currentLanguage: any;
  loading!:boolean;
  constructor(
    private _StudyService:StudyService,
    private _ActivatedRoute: ActivatedRoute,
    private _TranslateService:TranslateService,
    private _AuthenticationService:AuthenticationService,
    private _Title:Title,
    private _HomeService:HomeService ,
    private _ToastrService:ToastrService

  ) { }

  ngOnInit(): void {
    this.showUniversities();
    this.translateFunction();
    this.authenticationData()
    this.showPersonalInformation();
    this.showAcademicInformation();
    // this.showDestination();
  }
  showUniversities(){

    this._ActivatedRoute.paramMap.subscribe(
      (params:Params) => {
        this.loading = true;
        this._StudyService.getFacultyData(params['params'].faculty_id , params['params'].university_id ).subscribe(
          (response) => {
            console.log(response);
            this.facultyData = response.facultyData
            this.facultyUniversity = response.facultyUniversity
            this.facultyDatas = response.facultyDatas
            this.conditions = response.mejorData
            this.universityData = response.university
            this.loading = false;
            this._HomeService.getHomeData().subscribe(
              (response) => {
                const destinationConatiner = response.destinations.filter(
                  (destination:any) => {
                    return destination.id = params['params'].university_id;
                  }
                )

                this.destinationDetail = destinationConatiner[0];
                this.loading = false

              }
            )
          })
        }
    )
  }
  registerForm: FormGroup = new FormGroup({
    'destination': new FormControl('', Validators.required),
    'university': new FormControl('', Validators.required),
    'faculty': new FormControl('', Validators.required),
    'page': new FormControl('ss', Validators.required),
    'user_id': new FormControl('', Validators.required),
  })
  // registerForm: FormGroup = new FormGroup({
  //   'admission_destination_id': new FormControl('', Validators.required),
  //   'admission_university_id': new FormControl('', Validators.required),
  //   'admission_fac_uni_id': new FormControl('', Validators.required),
  //   'admission_fac_uni_major_id': new FormControl('', Validators.required),
  //   'user_id': new FormControl('', Validators.required),
  // })
  onRegister(registerForm:FormGroup){
    console.log(registerForm);
    console.log(registerForm.value);
    this._AuthenticationService.submitAdmissionInformation(
      registerForm.value
    ).subscribe(
      (response) => {
        console.log(response);
        if(this.currentLanguage === 'en'){
          this._ToastrService.success(`${response.success}`,`success`)

        }else if(this.currentLanguage === 'ar'){
          this._ToastrService.success(`${response.ar_success}`,`تسجيل صحيح`)
        }
      }
    )
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
      (language: any) => {
        if (language.lang == 'en') {
          this._Title.setTitle(`${environment.title}${this.facultyData?.en_name}`)
        }else if(language.lang == 'ar'){
          this._Title.setTitle(`${environment.title}${this.facultyData?.ar_name}`)

        }
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
}
