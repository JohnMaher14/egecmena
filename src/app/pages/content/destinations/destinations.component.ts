import { Component, OnInit, Renderer2 } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { HomeService } from 'src/app/services/home.service';
import { StudyService } from 'src/app/services/study.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-destinations',
  templateUrl: './destinations.component.html',
  styleUrls: ['./destinations.component.scss']
})
export class DestinationsComponent implements OnInit {
  currentLanguage: any;
  destinationImage:string = `${environment.imageUrl}destinations/`;
  destinations: any[] = [];
  loading!: boolean;
  term: any;
  constructor(
    private _TranslateService:TranslateService,
    private _Title:Title,
    private _StudyService:StudyService,
    private _Renderer2:Renderer2 
  ) { }

  ngOnInit(): void {
    this.translateFunction()
    this.showDestinations();
  }
  showDestinations(){
    let body = document.querySelector('body');
    this._Renderer2.setStyle(body, 'overflow' , 'hidden')
    this.loading = true;
    this._StudyService.getDestinations().subscribe(
      (response) => {
        this.destinations = response.destinations
        this.loading = false
        this._Renderer2.removeStyle(body, 'overflow')

      }
    )
  }
  translateFunction(){
    this.currentLanguage = localStorage.getItem("currentLanguage") || 'ar'
    this._TranslateService.use(this.currentLanguage)
    if (this.currentLanguage == 'en') {
      this._Title.setTitle(`${environment.title}Destinations`)
    }else if(this.currentLanguage == 'ar'){
      this._Title.setTitle(`${environment.title}البلاد`)

    }
    this._TranslateService.onLangChange.subscribe(
      (language: any) => {
        if (language.lang == 'en') {
          this._Title.setTitle(`${environment.title}Destinations`)
        }else if(language.lang == 'ar'){
          this._Title.setTitle(`${environment.title}البلاد`)

        }
        this.currentLanguage = this._TranslateService.currentLang
      }
    )
  }
}
