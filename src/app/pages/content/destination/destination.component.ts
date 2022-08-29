import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { HomeService } from 'src/app/services/home.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-destination',
  templateUrl: './destination.component.html',
  styleUrls: ['./destination.component.scss']
})
export class DestinationComponent implements OnInit {
  universities : any[] = [];
  destinations : any[] = [];
  destinationDetail: any;
  universityImage:string = `${environment.imageUrl}universities/`;
  currentLanguage: any;

  constructor(
    private _HomeService:HomeService,
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
        this._HomeService.getHomeData().subscribe(
          (response) => {

            const universitiesConatiner = response.university.filter(
              (universities: any) => {
                return universities.destination_id == params['params'].id;
              }
            )
            const destinationDetails = response.destinations.filter(
              (destination: any) => {
                return destination.id == params['params'].id;
              }
            )
            const destinationConatiner = response.destinations.filter(
              (destination: any) => {
                return destination.id != params['params'].id;
              }
            )
            this.destinationDetail = destinationDetails[0];
            this.universities = universitiesConatiner;
            this.destinations = destinationConatiner
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
          this._Title.setTitle(`${environment.title}${this.destinationDetail.en_name}`)
        }else if(language.lang == 'ar'){
          this._Title.setTitle(`${environment.title}${this.destinationDetail.ar_name}`)

        }
        this.currentLanguage = this._TranslateService.currentLang
      }
    )
  }
}
