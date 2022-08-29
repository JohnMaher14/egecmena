import { Component, OnInit } from '@angular/core';
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
  destinations : any[] = [];
  destinationDetail: any;
  universityImage:string = `${environment.imageUrl}universities/`;
  facultyImage:string = `${environment.imageUrl}faculties/`;
  destinationImage:string = `${environment.imageUrl}destinations/`;
  currentLanguage: any;

  constructor(
    private _StudyService:StudyService,
    private _HomeService:HomeService ,
    private _ActivatedRoute: ActivatedRoute,
    private _TranslateService:TranslateService,
    private _Title:Title

  ) { }

  ngOnInit(): void {
    this.showUniversities();
    this.translateFunction();
    this.showDestination();
  }
  showUniversities(){

    this._ActivatedRoute.paramMap.subscribe(
      (params:Params) => {
        this._StudyService.getUniversityData(params['params'].id).subscribe(
          (response) => {
            this.faculties = response.faculties;
            this.university = response.university;
          })
        }
    )
  }
  showDestination(){
    this._ActivatedRoute.paramMap.subscribe(
      (params:Params) => {
        this._HomeService.getHomeData().subscribe(
          (response) => {
            console.log(response);
            const destinationConatiner = response.destinations.filter(
              (destination:any) => {
                return destination.id = this.university.destination_id;
              }
            )

            this.destinationDetail = destinationConatiner[0];
            console.log(this.destinationDetail);
          }
        )
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

          console.log(this.university);
        }
        this.currentLanguage = this._TranslateService.currentLang
      }
    )
  }
}
