import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { AboutService } from 'src/app/services/about.service';
import { environment } from 'src/environments/environment';
import SwiperCore , { SwiperOptions , Navigation } from 'swiper';
SwiperCore.use([Navigation]);

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {
  loading: boolean = false;
  aboutUs!: any ;
  currentLang: any;
  currentLanguage: any;
  clients: any[] =[];
  clientImage: string = `${environment.imageUrl}clients/`;
  constructor(
    private _AboutService:AboutService,
    private _TranslateService:TranslateService,
    private _Title:Title
  ) { }

  ngOnInit(): void {
    this.showPartners();
    this.showAboutus();
    this.translateFunction()
  }
  showPartners(){
    this.loading = true;

    this._AboutService.getPartners().subscribe(
      (response) => {
        this.clients =  response;
        this.loading = false
      }
    )
  }
  showAboutus(){
    this.loading = true;

    this._AboutService.getAboutUs().subscribe(
      (response) => {
        this.aboutUs = response.about;
        this.loading = false

      }
    )
  }
  translateFunction(){
    this.currentLang = localStorage.getItem("currentLanguage") || 'ar'
    this._TranslateService.use(this.currentLang)
    this._TranslateService.onLangChange.subscribe(
      (language: any) => {
        if (language.lang == 'en') {
          this._Title.setTitle(`${environment.title}About us`)
        }else if(language.lang == 'ar'){
          this._Title.setTitle(`${environment.title}عنا`)

        }
        this.currentLanguage = this._TranslateService.currentLang
      }
    )
  }
  clientsSlider: SwiperOptions = {
    slidesPerView: 3,
    spaceBetween: 50,
    loop: true,
    autoplay:true,
    // navText: [`<i class="fa fa-angle-right"></i>`
    // , `<i class="fa fa-angle-left"></i>`],

    breakpoints: {
      0: {
        slidesPerView: 1
      },
      400: {
        slidesPerView: 3
      },

      940: {

        slidesPerView: 4,
      },
      1600: {

        slidesPerView: 4,
      }
    }
  }
  onSwiper([swiper]:any) {
    console.log(swiper);
  }
  onSlideChange() {
    console.log('slide change');
  }
}
