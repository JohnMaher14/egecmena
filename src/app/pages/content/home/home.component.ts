import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HomeService } from 'src/app/services/home.service';
import { StudyService } from 'src/app/services/study.service';
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
  faculties: any[] = [];
  majors: any[] = [];
  departments: any[] = [];
  universityOnchangeId!:number;
  facultyUniversity: any[] = [];
  changeUniversities: any[] = [];
  changeFaculty: any[] = [];
  userReviews: any[] = [];
  blogs: any[] = [];
  blogImage: string = `${environment.imageUrl}blogs`;
  reviewImage: string = `${environment.imageUrl}contact/`;
  currentLanguage:any;
  currentLang:any;
  constructor(
    public _TranslateService: TranslateService,
    private _Title: Title,
    private _HomeService: HomeService,
    private _StudyService:StudyService,
    private _Router:Router
    ) {

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
    if (this.currentLanguage == 'en') {
      this._Title.setTitle(`${environment.title}Home`)
    }else if(this.currentLanguage  == 'ar'){
      this._Title.setTitle(`${environment.title}الصفحة الريسية`)

    }
    this._TranslateService.onLangChange.subscribe(
      () => {
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
      this.faculties = response.faculty;
      this.facultyUniversity = response.facultyUniversity;
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
  admissionForm: FormGroup = new FormGroup({
    'destination' : new FormControl('', Validators.required),
    'university' : new FormControl('', Validators.required),
    'faculty' : new FormControl('', Validators.required),
    'major' : new FormControl('', Validators.required),
    'department' : new FormControl('', Validators.required),
  })
  onSubmitSearch(admissionForm:FormGroup){

    if(this.admissionForm.value.university == '' && this.admissionForm.value.faculty == '' && this.admissionForm.value.major == '' && this.admissionForm.value.department == '' ){
      this._Router.navigateByUrl(`/destination/${this.admissionForm.value.destination}`)
    }else if(this.admissionForm.value.faculty == '' && this.admissionForm.value.major == '' && this.admissionForm.value.department == '' ){
      this._Router.navigateByUrl(`/university/${this.admissionForm.value.university}`)

    }else{
      this._Router.navigateByUrl(`/faculty/${this.admissionForm.value.faculty}/${this.admissionForm.value.university}`)

    }
  }
  onChangeDestination(event: any) {
    const universitiesArray = this.universities.filter((universities: any) => {
      return universities.destination_id == event.target.value;
    });
    this.changeUniversities = universitiesArray;
  }
  onChangeUniversity(event: any) {
    const facultyArray = this.facultyUniversity.filter((faculty: any) => {
      return faculty.university_id == event.target.value ;
    });
    this.universityOnchangeId = event.target.value
    this.changeFaculty = facultyArray;
  }
  onChangeFaculty(event: any) {
    const majorArray = this.facultyUniversity.filter((major: any) => {
      return major.faculty_id == event.target.value && major.university_id == this.universityOnchangeId;
    });
    this._StudyService.getFacultyData(majorArray[0].faculty_id , majorArray[0].university_id).subscribe(
      (response) => {
        this.majors = response.facultyUniversity.majors
      }
    )
  }
  onMajorSaerch(event: any){
    const departmentsArray = this.majors.filter(
      (response) => {
        return response.id == event.target.value;
      }
    )
    this.departments = departmentsArray[0].pivot.departments;

  }
}
