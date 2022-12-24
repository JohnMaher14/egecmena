import { Component, OnInit, Renderer2 } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.scss']
})
export class BlogsComponent implements OnInit {

  currentLanguage:any;
  loading!:boolean;
  constructor(
    private _TranslateService:TranslateService,
    private _Title:Title,
    private _Renderer2:Renderer2
  ) { }

  ngOnInit(): void {
    this.translateFunction()
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
      this._Title.setTitle(`${environment.title}Blogs `)
    }else if(this.currentLanguage == 'ar'){
      this._Title.setTitle(`${environment.title}  المقالات`)

    }
    this._TranslateService.onLangChange.subscribe(
      (language) => {
        if (language.lang == 'en') {
          this._Title.setTitle(`${environment.title}Blogs`)
        }else if(language.lang == 'ar'){
          this._Title.setTitle(`${environment.title} المقالات`)

        }
        this.currentLanguage = this._TranslateService.currentLang
      }
    )
  }
}
