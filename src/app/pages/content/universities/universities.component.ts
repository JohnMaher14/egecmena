import { Component, OnInit, Renderer2 } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { HomeService } from 'src/app/services/home.service';
import { StudyService } from 'src/app/services/study.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-universities',
  templateUrl: './universities.component.html',
  styleUrls: ['./universities.component.scss']
})
export class UniversitiesComponent implements OnInit {
  faculties: any[] = [];
  university: any;
  universities: any[]=[];
  destinations : any[] = [];
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
    private _Title:Title,
    private _Renderer2:Renderer2,
    private _Router:Router
  ) { }

  ngOnInit(): void {
    this.showUniversities();
    this.translateFunction();
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
  showFaculties(id:number){
    let body = document.querySelector('body');
    this._Renderer2.setStyle(body, 'overflow' , 'hidden')
    this.loading = true;
    this._StudyService.getUniversityFaculty(id).subscribe(
      (response) => {
        const facultyArray = response.Faculties.filter(
          (response:any) =>{

            return response.university_id == id;
          }
        )
        this.faculties = facultyArray;
        this.loading = false
        this._Renderer2.removeStyle(body, 'overflow')
      }
    )

  }
  showUniversities(){

    this._ActivatedRoute.paramMap.subscribe(
      (params:Params) => {
        let body = document.querySelector('body');
        this._Renderer2.setStyle(body, 'overflow' , 'hidden')
        this.loading = true;

        this._StudyService.getUniversityData(params['params'].university_slug ,
          localStorage.getItem("currentLanguage")
        ).subscribe(
          (response) => {
            this.university = response.university;

            this._StudyService.getDestinationDetails(params['params'].destination_slug,
            localStorage.getItem("currentLanguage") || '{}'
            ).subscribe(
              (response) => {
                this.destinationDetail = response.country;
                function func(a:any, b:any) {
                  return 0.5 - Math.random();
                }
                response.universities.sort(func)
                this.universities = response.universities;
                this.loading = false
                this._Renderer2.removeStyle(body, 'overflow')
              }
            )

            this._TranslateService.onLangChange.subscribe(
              (currentLanguage: any) => {
                if(currentLanguage.lang === 'ar'){

                  this._Title.setTitle(`${environment.title}${response.university?.ar_name}`)
                  this._Router.navigate([`/university`  , this.destinationDetail?.ar_slug , response.university?.ar_slug])

                  }else if(currentLanguage.lang === 'en'){
                    this._Title.setTitle(`${environment.title}${response.university?.en_name}`)
                    this._Router.navigate([`/university`  , this.destinationDetail?.en_slug , response.university?.en_slug])
                  }
              }
            )
              if(this.currentLanguage === 'ar'){

                this._Title.setTitle(`${environment.title}${response.university?.ar_name}`)

                }else if(this.currentLanguage === 'en'){
                  this._Title.setTitle(`${environment.title}${response.university?.en_name}`)
                }
            // this.loading = false;

          })
        }
    )
  }


}
