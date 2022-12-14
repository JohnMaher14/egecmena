import { Component, OnInit, Renderer2 } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { HomeService } from 'src/app/services/home.service';
import { StudyService } from 'src/app/services/study.service';
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
  destinationImage:string = `${environment.imageUrl}destination/`;
  currentLanguage: any;
  loading!:boolean;
  term:any;
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
  showUniversities(){
    this._ActivatedRoute.paramMap.subscribe(
      (params:Params) => {
        let body = document.querySelector('body');
        this._Renderer2.setStyle(body, 'overflow' , 'hidden')
        this.loading = true;
        this._StudyService.getDestinationDetails(params['params'].slug,
          localStorage.getItem('currentLanguage') || '{}'
        ).subscribe(

          (response) => {
            this.destinationDetail = response.country;
            const universitiesConatiner = response.universities.filter(
              (universities: any) => {
                return universities.destination_id == response.country?.id;
              }
            )
            if (this.currentLanguage == 'en') {
              this._Title.setTitle(`${environment.title}${this.destinationDetail?.en_name}`)
            }else if(this.currentLanguage == 'ar'){
              this._Title.setTitle(`${environment.title}${this.destinationDetail?.ar_name}`)

            }
            this._TranslateService.onLangChange.subscribe(
              (language:any) => {
                if (language.lang == 'en') {
                  this._Title.setTitle(`${environment.title}${this.destinationDetail?.en_name}`)
                  this._Router.navigate([`/destination`, this.destinationDetail?.en_slug])
                }else if(language.lang == 'ar'){
                  this._Title.setTitle(`${environment.title}${this.destinationDetail?.ar_name}`)
                  this._Router.navigate([`/destination`, this.destinationDetail?.ar_slug])

                }
              }
            )
            this.universities= universitiesConatiner;
            // this.destinations;
            this._Renderer2.removeStyle(body, 'overflow')
            this.loading = false
          }
        )
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
