import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HomeService } from 'src/app/services/home.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  loading: boolean = false;
  destinations: any[] = [];
  universities: any[] = [];
  changeUniversities: any[] = [];
  userReviews: any[] = [];
  blogs: any[] = [];
  blogImage: string = `${environment.imageUrl}blogs`;
  reviewImage: string = `${environment.imageUrl}contact/`;
  currentLanguage:any;
  currentLang:any;
  constructor(
    public _TranslateService: TranslateService,
    private _Title: Title,
    private _HomeService: HomeService  ) {

     }
  showcurrentLanguage(language:any){
    this._TranslateService.use(language);
    localStorage.setItem("currentLanguage",language)
  }
  ngOnInit(): void {
    this.showHomeData();
    this.showReviews();
    this.showBlogs();
    this.currentLanguage = localStorage.getItem("currentLanguage") || 'en'
    this._TranslateService.use(this.currentLanguage)
    this._TranslateService.onLangChange.subscribe(
      (language: any) => {
        if (language.lang == 'en') {
          this._Title.setTitle(`${environment.title}Home`)
        }else if(language.lang == 'ar'){
          this._Title.setTitle(`${environment.title}الصفحة الريسية`)

        }
        this.currentLanguage = this._TranslateService.currentLang
      }
    )
  }

  testimonials: OwlOptions = {
    loop: true,
    // center: true,
    dots: true,
    margin:30,
    autoplay: false,
    navSpeed: 700,
    navText: [`<i class="fa fa-angle-left"></i>`
    , `<i class="fa fa-angle-right"></i>`],

    nav: true,
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },

      940: {

        items: 2,
      },
      1600: {

        items: 2,
      }
    }
  }
  testimonialsAr: OwlOptions = {
    loop: true,
    // center: true,
    dots: true,
    autoHeight:true,

    margin:30,
    autoplay: false,
    rtl: true,
    navSpeed: 700,
    navText: [`<i class="fa fa-angle-right"></i>`
    , `<i class="fa fa-angle-left"></i>`],

    nav: true,
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },

      940: {

        items: 2,
      },
      1600: {

        items: 2,
      }
    }
  }
  showHomeData() {
    this._HomeService.getHomeData().subscribe((response) => {
      this.destinations = response.destinations;
      this.universities = response.university;
    });
  }
  showReviews() {
    this.loading = true;

    this._HomeService.getTestominals().subscribe((response) => {
      this.userReviews = response.reviews;
      this.loading = false;
    });
  }
  showBlogs() {
    this.loading = true;

    this._HomeService.getBlogs().subscribe((response) => {
      this.blogs = response.blogs;
      this.loading = false;
    });
  }
  onChangeDestination(event: any) {
    console.log(event.target.value);
    const universitiesArray = this.universities.filter((universities: any) => {
      return universities.destination_id == event.target.value;
    });
    this.changeUniversities = universitiesArray;
  }

}
