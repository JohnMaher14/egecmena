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

    this.currentLanguage =  localStorage.getItem('currentLanguage') || 'ar';
    this._TranslateService.use(this.currentLanguage);

    if(localStorage.getItem('currentLanguage') === ''){
      localStorage.setItem('currentLanguage' , 'ar')
      this._render.addClass(document.body, 'rtl')
    }
    else if(this.currentLanguage === 'ar'){
      localStorage.setItem('currentLanguage' , 'ar')
      this._render.addClass(document.body, 'rtl')
      let script = this._render.createElement('script')
      script.id = `chatbot`;
      script.text = `window.sntchChat.Init(261781)`;

      this._render.appendChild(document.body, script);
    }else{
      this._render.removeClass(document.body, 'rtl')
      localStorage.setItem('currentLanguage' , 'en')
      let script = this._render.createElement('script')
      script.id = `chatbot`;

      script.text = `window.sntchChat.Init(261645)`;

      this._render.appendChild(document.body, script);
    }
    this._TranslateService.onLangChange.subscribe(
      (language) => {
        if (language.lang == 'en') {
          this._render.removeClass(document.body, 'rtl')
          let webchat = document.querySelector('#sntch_webchat div');
          let iframe = document.querySelector('#sntch_webchat #sntch_iframe');
          iframe?.setAttribute('src' , 'https://webbot.me/79ddcf230674b2c36964fab607d6ab1a6a1cdcfb9cbaf18b14f9692b62f8e4a9?test=0&start=&botID=261645&embedScript=1&landing=0')

        }else if(language.lang == 'ar'){
          this._render.addClass(document.body, 'rtl')
          let webchat = document.querySelector('#sntch_webchat div');
          let iframe = document.querySelector('#sntch_webchat #sntch_iframe');
          iframe?.setAttribute('src' , 'https://webbot.me/f326dbcb9f272ca3d85df873d2656d064308713c910e255627e46f742bc7eda8?test=0&start=&botID=261781&embedScript=1&landing=0')

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
