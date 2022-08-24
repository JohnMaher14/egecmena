import { Component, OnInit, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgwWowService } from 'ngx-wow';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Egecmena';
  currentLanguage:any
  show:boolean=true;
  currentLang:any;
  constructor(
    public _TranslateService:TranslateService,
    private _render:Renderer2,
    private _NgwWowService:NgwWowService

  ){}
  ngOnInit(): void {

    this.currentLang =  localStorage.getItem('currentLanguage') || 'ar';
    this._TranslateService.use(this.currentLang);
    console.log(this.currentLang);
    if(this.currentLang === 'ar'){
      localStorage.setItem('currentLanguage' , 'ar')
      this._render.addClass(document.body, 'rtl')
    }else{
      this._render.removeClass(document.body, 'rtl')
      localStorage.setItem('currentLanguage' , 'en')

    }
    this._TranslateService.onLangChange.subscribe(
      (language) => {
        if (language.lang == 'en') {
          this._render.removeClass(document.body, 'rtl')
        }else if(language.lang == 'ar'){
          this._render.addClass(document.body, 'rtl')

        }
        this.currentLanguage = this._TranslateService.currentLang
      }
    )

      this._NgwWowService.init();

  }
  showCurrentLanguage(language: any){
    this._TranslateService.use(language);
    localStorage.setItem('currentLanguage', language)
  }
}
