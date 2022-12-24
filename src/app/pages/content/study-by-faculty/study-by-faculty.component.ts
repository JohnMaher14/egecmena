import { Component, OnInit, Renderer2 } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { HomeService } from 'src/app/services/home.service';
import { StudyService } from 'src/app/services/study.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-study-by-faculty',
  templateUrl: './study-by-faculty.component.html',
  styleUrls: ['./study-by-faculty.component.scss']
})
export class StudyByFacultyComponent implements OnInit {
  faculties: any[] = [];
  university: any;
  destinations : any[] = [];
  specialId!: number;
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
        let body = document.querySelector('body');
        this._Renderer2.setStyle(body, 'overflow' , 'hidden')
        this.loading = true
        this.specialId = params['params'].id;
        this._StudyService.studyByFaculty(params['params'].id).subscribe(
          (response) => {
            this.faculties = response.faculty

            if (this.currentLanguage == 'en') {
              this._Title.setTitle(`${environment.title}Faculties`)
            }else if(this.currentLanguage == 'ar'){
              this._Title.setTitle(`${environment.title}كليات`)

            }
            this._TranslateService.onLangChange.subscribe(
              (language) => {
                if (language.lang == 'en') {
                  this._Title.setTitle(`${environment.title}Faculties`)
                }else if(language.lang== 'ar'){
                  this._Title.setTitle(`${environment.title}كليات`)

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
