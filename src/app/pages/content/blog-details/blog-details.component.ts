import { Component, OnInit } from '@angular/core';
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
  constructor(
    private _TranslateService:TranslateService,
    private _Title:Title
  ) { }

  ngOnInit(): void {
    this.translateFunction()
  }
  translateFunction(){
    this.currentLanguage = localStorage.getItem("currentLanguage") || 'ar'
    this._TranslateService.use(this.currentLanguage)
    if (this.currentLanguage== 'en') {
      this._Title.setTitle(`${environment.title}Blogs details`)
    }else if(this.currentLanguage == 'ar'){
      this._Title.setTitle(`${environment.title} تفاصيل المقالات`)

    }
    this._TranslateService.onLangChange.subscribe(
      (language) => {
        if (language.lang == 'en') {
          this._Title.setTitle(`${environment.title}Blogs details`)
        }else if(language.lang == 'ar'){
          this._Title.setTitle(`${environment.title} تفاصيل المقالات`)
    
        }
        this.currentLanguage = this._TranslateService.currentLang
      }
    )
  }
}
