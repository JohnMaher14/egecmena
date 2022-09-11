import { Component, OnInit, Renderer2 } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
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
    private _HomeService:HomeService ,
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
        this.loading = true;

        this._StudyService.getUniversityData(params['params'].id).subscribe(
          (response) => {
            this.faculties = response.faculties;
            this.university = response.university;
            this.loading = true
            this._HomeService.getHomeData().subscribe(
              (response) => {
                const universityContainer = response.university.filter(
                  (university:any) => {
                    // university =  Math.floor(Math.random())
                    // university.Math.floor(Math.random())
                    return university.id != params['params'].id;
                  }
                  )

                  function func(a:any, b:any) {
                    return 0.5 - Math.random();
                  }
                  universityContainer.sort(func)
                  this.universities = universityContainer;
                const destinationConatiner = response.destinations.filter(
                  (destination:any) => {
                    return destination.id = response.university;
                  }
                )

                this.destinationDetail = destinationConatiner[0];
                this._Renderer2.removeStyle(body, 'overflow')
                this.loading = false

              }
            )
            this._TranslateService.onLangChange.subscribe(
              (currentLanguage: any) => {
                if(currentLanguage.lang === 'ar'){

                  this._Title.setTitle(`${environment.title}${response.university?.ar_name}`)
  
                  }else if(currentLanguage.lang === 'en'){
                    this._Title.setTitle(`${environment.title}${response.university?.en_name}`)
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
