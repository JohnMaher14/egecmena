import { Component, OnInit, Renderer2 } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.scss']
})
export class BlogDetailsComponent implements OnInit {
  currentLanguage:any;
  loading!:boolean;
  constructor(
    private _TranslateService:TranslateService,
    private _Title:Title,
    private _Renderer2:Renderer2
  ) { }

  ngOnInit(): void {
    this.translateFunction();
    this.loader();
  }
  loader(){
    let body = document.querySelector('body');
    this._Renderer2.setStyle(body, 'overflow' , 'hidden')
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      this._Renderer2.removeStyle(body, 'overflow')

    }, 1500);
  }
  translateFunction(){
    this.currentLanguage = localStorage.getItem("currentLanguage") || 'ar'
    this._TranslateService.use(this.currentLanguage)
    if (this.currentLanguage== 'en') {
      this._Title.setTitle(`${environment.title}Egypt takes the lead in receiving international students from Arab countries `)
    }else if(this.currentLanguage == 'ar'){
      this._Title.setTitle(`${environment.title} الطلاب الوافدين من الدول العربية مصر تحتل الصدارة في استقبال `)

    }
    this._TranslateService.onLangChange.subscribe(
      (language) => {
        if (language.lang == 'en') {
          this._Title.setTitle(`${environment.title}Egypt takes the lead in receiving international students from Arab countries `)
        }else if(language.lang == 'ar'){
          this._Title.setTitle(`${environment.title} الطلاب الوافدين من الدول العربية مصر تحتل الصدارة في استقبال `)

        }
        this.currentLanguage = this._TranslateService.currentLang
      }
    )
  }
}
