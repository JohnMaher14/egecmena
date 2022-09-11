import { Component, OnInit, Renderer2 } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { StudyService } from 'src/app/services/study.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-study-by-faculty-university',
  templateUrl: './study-by-faculty-university.component.html',
  styleUrls: ['./study-by-faculty-university.component.scss']
})
export class StudyByFacultyUniversityComponent implements OnInit {

  faculties: any[] = [];
  university: any;
  faculty:any;
  universities : any[] = [];
  destinationDetail: any;
  universityImage:string = `${environment.imageUrl}universities/`;
  facultyImage:string = `${environment.imageUrl}faculties/`;
  destinationImage:string = `${environment.imageUrl}destinations/`;
  currentLanguage: any;
  loading!:boolean;
  term:any;
  constructor(
    private _StudyService:StudyService,
    private _ActivatedRoute: ActivatedRoute,
    private _TranslateService:TranslateService,
    private _Title:Title,
    private _Renderer2:Renderer2

  ) { }

  ngOnInit(): void {
    this.showUniversities();
    this.translateFunction();
  }
  showUniversities(){

    this._ActivatedRoute.paramMap.subscribe(
      (params:Params) => {
        console.log(params['params'].faculty_id);
        let body = document.querySelector('body');
        this._Renderer2.setStyle(body, 'overflow' , 'hidden')
        this.loading = true;
        this._StudyService.studyByFaculty(params['params'].special_id).subscribe(
          (response) => {
            console.log(response.faculty);
            this.faculty = response.faculty[0];
            const universityArray = response.faculty.filter(
              (responseData:any) => {
                console.log(responseData);
                return responseData.id == params['params'].faculty_id;
              }

            )
            this.university = universityArray[0];
            console.log(this.university);
            if (this.currentLanguage == 'en') {
              this._Title.setTitle(`${environment.title}${this.university?.en_name}`)
            }else if(this.currentLanguage == 'ar'){
              this._Title.setTitle(`${environment.title}${this.university?.ar_name}`)

            }
            this._TranslateService.onLangChange.subscribe(
              (language) => {
                if (language.lang == 'en') {
                  this._Title.setTitle(`${environment.title}${this.university?.en_name}`)
                }else if(language.lang == 'ar'){
                  this._Title.setTitle(`${environment.title}${this.university?.ar_name}`)
    
                }
              }
            )
            this._Renderer2.removeStyle(body, 'overflow')
            this.loading = false;
          })
        }
    )
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

}
