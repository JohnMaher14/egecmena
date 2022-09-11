import { Component, OnInit, Renderer2 } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { AboutService } from 'src/app/services/about.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {
  loading: boolean = false;
  aboutUs!: any ;
  currentLanguage: any;
  clients: any[] =[];
  clientImage: string = `${environment.imageUrl}clients/`;
  constructor(
    private _AboutService:AboutService,
    private _TranslateService:TranslateService,
    private _Title:Title,
    private _Meta:Meta,
    private _Renderer2:Renderer2
  ) { }

  ngOnInit(): void {
    this.showPartners();
    this.showAboutus();
    this.translateFunction()
    this._Meta.addTags([

      {name: 'description' , content: 'ssssssssssssssss'}
    ])
  }
  showPartners(){
    this.loading = true;
    let body = document.querySelector('body');
    this._Renderer2.setStyle(body, 'overflow' , 'hidden')
    this._AboutService.getPartners().subscribe(
      (response) => {
        this.clients =  response;
        this.loading = false
        this._Renderer2.removeStyle(body, 'overflow')
      }
    )
  }
  showAboutus(){
    let body = document.querySelector('body');
    this._Renderer2.setStyle(body, 'overflow' , 'hidden')
    this.loading = true;

    this._AboutService.getAboutUs().subscribe(
      (response) => {
        this.aboutUs = response.about;
        
        this._Renderer2.removeStyle(body, 'overflow')

        this.loading = false

      }
    )
  }
  translateFunction(){
    this.currentLanguage = localStorage.getItem("currentLanguage") || 'ar'
    this._TranslateService.use(this.currentLanguage)
    if (this.currentLanguage== 'en') {
      this._Title.setTitle(`${environment.title}About us`)
    }else if(this.currentLanguage == 'ar'){
      this._Title.setTitle(`${environment.title}من نحن`)

    }
    this._TranslateService.onLangChange.subscribe(
      (language: any) => {
        if (language.lang == 'en') {
          this._Title.setTitle(`${environment.title}About us`)
        }else if(language.lang  == 'ar'){
          this._Title.setTitle(`${environment.title}من نحن`)
    
        }
        this.currentLanguage = this._TranslateService.currentLang
      }
    )
  }
  clientsSlider: OwlOptions = {
    loop: true,
    dots: false,
    margin:30,
    rtl: true,
    autoplay: true,
    nav: false,
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      940: {

        items: 3,
      },
      1024: {

        items: 4,
      },

    }
  }

}
