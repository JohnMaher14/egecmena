import { Component, OnInit } from '@angular/core';
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
  constructor(
    private _StudyService:StudyService,
    private _ActivatedRoute: ActivatedRoute,
    private _TranslateService:TranslateService,
    private _Title:Title

  ) { }

  ngOnInit(): void {
    this.showUniversities();
    this.translateFunction();
  }
  showUniversities(){

    this._ActivatedRoute.paramMap.subscribe(
      (params:Params) => {
        this.loading = true
        this.specialId = params['params'].id;
        this._StudyService.studyByFaculty(params['params'].id).subscribe(
          (response) => {
            this.faculties = response.faculty
            this.loading = false;

          })
        }
    )
  }

  translateFunction(){
    this.currentLanguage = localStorage.getItem("currentLanguage") || 'ar'
    this._TranslateService.use(this.currentLanguage)
    this._TranslateService.onLangChange.subscribe(
      (language: any) => {
        if (language.lang == 'en') {
          this._Title.setTitle(`${environment.title}${this.university?.en_name}`)
        }else if(language.lang == 'ar'){
          this._Title.setTitle(`${environment.title}${this.university?.ar_name}`)

        }
        this.currentLanguage = this._TranslateService.currentLang
      }
    )
  }

}
