import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
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
  isLogined!:boolean;
  universityImage:string = `${environment.imageUrl}universities/`;
  facultyImage:string = `${environment.imageUrl}faculties/`;
  destinationImage:string = `${environment.imageUrl}destinations/`;
  currentLanguage: any;

  constructor(
    private _StudyService:StudyService,
    private _ActivatedRoute: ActivatedRoute,
    private _TranslateService:TranslateService,
    private _AuthenticationService:AuthenticationService,
    private _Title:Title

  ) { }

  ngOnInit(): void {
    this.showUniversities();
    this.translateFunction();
    this.authenticationData()
    // this.showDestination();
  }
  showUniversities(){

    this._ActivatedRoute.paramMap.subscribe(
      (params:Params) => {
        this._StudyService.getFacultyData(params['params'].faculty_id , params['params'].university_id ).subscribe(
          (response) => {
            console.log(response);
            this.facultyData = response.facultyData
            this.facultyUniversity = response.facultyUniversity
            this.facultyDatas = response.facultyDatas
            this.conditions = response.mejorData
            this.universityData = response.university
          })
        }
    )
  }
  registerForm: FormGroup = new FormGroup({
    'admission_destination_id': new FormControl('', Validators.required),
    'admission_university_id': new FormControl('', Validators.required),
    'admission_fac_uni_id': new FormControl('', Validators.required),
    'admission_fac_uni_major_id': new FormControl('', Validators.required),
    'user_id': new FormControl('', Validators.required),
  })
  onRegister(registerForm:FormGroup){
    console.log(registerForm.value);
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
    console.log(this.userArray);
    this._AuthenticationService.currentUserData.subscribe(() => {
      if (this._AuthenticationService.currentUserData.getValue() == null) {
        this.isLogined = false;
      } else {
        this.userArray = JSON.parse(
          sessionStorage.getItem('currentUserArray') || '{}'
        );
        console.log(JSON.parse(
          sessionStorage.getItem('currentUserArray') || '{}'
        ));
        this.isLogined = true;
      }
    });
  }
}
