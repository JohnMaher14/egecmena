import { Component, OnInit, Renderer2, ViewChild , ElementRef} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { map, Observable, startWith } from 'rxjs';
import { DependentFormService } from 'src/app/services/dependent-form.service';
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
  destinationsContainer: any[] = [];
  universities: any[] = [];
  faculties: any[] = [];
  majors: any[] = [];
  selectedValue?: string;
  selectedOption: any;
  previewOption?: any;
  arrayOfAll: any[] = [];
  departments: any[] = [];
  universityChoice:boolean =  false;
  facultyChoice:boolean =  false;
  majorChoice:boolean =  false;
  departmentChoice:boolean =  false;
  onChangeDestinationLoader:boolean = false;
  onChangeUniversityLoader:boolean = false;
  onChangeFacultyLoader:boolean = false;
  onChangeMajorLoader:boolean = false;
  onReadySearchData:boolean = true;
  universityOnchangeId:string= '';
  facultyUniversity: any[] = [];
  changeUniversities: any;
  changeFaculty: any;
  changeMajor: any;
  changeDepartment: any;
  userReviews: any[] = [];
  blogs: any[] = [];
  blogImage: string = `${environment.imageUrl}blogs`;
  reviewImage: string = `${environment.imageUrl}contact/`;
  currentLanguage:any;
  actionLoading!:boolean;
  @ViewChild('homeSearchInput') homeSearchInput!:ElementRef;
  constructor(
    public _TranslateService: TranslateService,
    private _Title: Title,
    private _HomeService: HomeService,
    private _DependentFormService:DependentFormService ,
    private _Router:Router,
    private _StudyService:StudyService,
    private _Renderer2:Renderer2
    ) {

     }

  ngOnInit(): void {
    this.showReviews();
    this.showBlogs();
    this.showDestination();
    this.currentLanguage = localStorage.getItem("currentLanguage") || 'en'
    this._TranslateService.use(this.currentLanguage)
    if (this.currentLanguage == 'en') {
      this._Title.setTitle(`${environment.title}Egyptian Gulf For Educational Consultant`)
    }else if(this.currentLanguage  == 'ar'){
      this._Title.setTitle(`${environment.title}المصرية الخليجية للخدمات التعليمية`)

    }
    this._TranslateService.onLangChange.subscribe(
      (language: any) => {
        if (language.lang == 'en') {
          this._Title.setTitle(`${environment.title}Egyptian Gulf For Educational Consultant`)
        }else if(language.lang  == 'ar'){
          this._Title.setTitle(`${environment.title}المصرية الخليجية للخدمات التعليمية`)

        }
        this.currentLanguage = this._TranslateService.currentLang
      }
    )

  }

  showDestination(){
    this._StudyService.getDestinations().subscribe(
      (response) => {
        this.destinations = response.destinations;
      }
    )
  }
  onSelect(event: TypeaheadMatch): void {
    this.selectedOption = event.item;
    if (event.item.en_about_the_destination) {
      if(localStorage.getItem("currentLanguage") == 'en'){

      this._Router.navigate(['/destination/', event.item.en_slug]);
      }else{
        this._Router.navigate(['/destination/', event.item.ar_slug]);

      }
    } else if (event.item.special_id) {
      // console.log(event.item.university[0].en_slug , event.item);
      if(localStorage.getItem("currentLanguage") == 'en'){
        this._Router.navigate([`/faculty/${event.item.en_slug}/${event.item.university[0].en_slug}`]);
      }else{
        this._Router.navigate([`/faculty/${event.item.ar_slug}/${event.item.university[0].ar_slug}`]);

      }
    } else if (event.item.en_about_the_university) {
      if(localStorage.getItem("currentLanguage") == 'en'){
        this._Router.navigate([`/university/${ event.item.destination[0].en_slug}`, event.item.en_slug]);
      }else{
        this._Router.navigate([`/university/${ event.item.destination[0].ar_slug}`, event.item.ar_slug]);

      }
    }else if(event.item.en_department_mission){
      this._Router.navigate([`/department/${event.item.pivot?.faculty_major_university_id}/${event.item.id}`])
    }
  }
  preventEnglish(event:any){
    var char = String.fromCharCode(event.which);
    console.log(this.currentLanguage);
    if (this.currentLanguage === 'ar') {
      if((/[a-zA-Z]/.test(char))){
        // this.searchFooterMessage = true;
        event.preventDefault();
      }
    }else{
      if((!/[a-zA-Z]/.test(char))){

        event.preventDefault();
      }
    }
  }
  onPreview(event: TypeaheadMatch): void {
    if (event) {
      this.previewOption = event.item;
    }
    else {
      this.previewOption = null;
    }
  }
  testimonials: OwlOptions = {
    loop: true,
    center: true,
    dots: true,
    margin:30,
    autoHeight: true,
    autoplay: true,
    navSpeed: 700,
    navText: [`<i class="fa fa-angle-left"></i>`
    , `<i class="fa fa-angle-right"></i>`],

    nav: true,
    responsive: {
      0: {
        items: 1,
        center: false,

      },
      500: {
        items: 1,
        center: false
      },

      940: {

        items: 1,
        stagePadding:200
      },
      1600: {

        items: 1,
        stagePadding:200
      }
    }
  }
  testimonialsAr: OwlOptions = {
    loop: true,
    center: true,
    dots: true,
    autoHeight: true,
    margin:30,
    autoplay: true,
    rtl: true,
    navSpeed: 700,
    navText: [`<i class="fa fa-angle-right"></i>`
    , `<i class="fa fa-angle-left"></i>`],

    nav: true,
    responsive: {
      0: {
        items: 1,
        center: false,

      },
      500: {
        items: 1,
        center: false
      },

      940: {

        items: 1,
        stagePadding:200
      },
      1600: {

        items: 1,
        stagePadding:200
      }
    }
  }
  showHomeData() {
    let homeSearchInput = document.querySelector('.homeSearchInput');
    this._Renderer2.setAttribute(homeSearchInput ,  'disabled' , 'disabled')
    this.onReadySearchData = true;
    this._HomeService.getHomeData().subscribe((response) => {
      this.faculties = response.faculty;
      this.universities = response.university;
      // this.destinations = response.destinations;
      this.universities.forEach(
        (destinations:any) => {
          return destinations.destination = this.destinations.filter(
            (destinationResponse) => {
              return destinationResponse.id == destinations.destination_id;
            }
          );
        }
      )
      response.Department.forEach((element:any) => {
        this.facultyUniversity.push(element.faculty_university);
        element.departments.forEach((departments:any) => {
          this.departments.push(departments)
        });

      });
      const facultyArray = this.faculties.map(v => ({ ...v, ...this.facultyUniversity.find((sp) => sp.faculty_id === v.id) }));
      facultyArray.forEach(
        (response) => {
          return response.university = this.universities.filter(
            (universityResponse) => {
              return universityResponse.id == response.university_id;
            }
          );
        }
      )



      this.arrayOfAll = this.universities.concat(
        this.universities,
        this.destinations,
        facultyArray,
        this.departments
      );
      this._Renderer2.removeAttribute(homeSearchInput , 'disabled')
      this.onReadySearchData = false;
    });
  }
  showReviews() {
    let body = document.querySelector('body');
    this._Renderer2.setStyle(body, 'overflow' , 'hidden')
    this.loading = true;

    this._HomeService.getTestominals().subscribe((response) => {
      this.userReviews = response.reviews;
      this._Renderer2.removeStyle(body, 'overflow')
      this.loading = false;
      this.showHomeData();
    });
  }
  showBlogs() {
    let body = document.querySelector('body');
    this._Renderer2.setStyle(body, 'overflow' , 'hidden')
    this.loading = true;

    this._HomeService.getBlogs().subscribe((response) => {
      this.blogs = response.blogs;
      this._Renderer2.removeStyle(body, 'overflow')

      this.loading = false;
    });
  }
  admissionForm: FormGroup = new FormGroup({
    'destination' : new FormControl('', Validators.required),
    'university' : new FormControl(''),
    'faculty' : new FormControl(''),
    'major' : new FormControl(''),
    'department' : new FormControl(''),
    'universitySlug' : new FormControl(null),
  })
  onSubmitSearch(admissionForm:FormGroup){

    if(this.admissionForm.value.university == '' && this.admissionForm.value.faculty == '' && this.admissionForm.value.major == '' && this.admissionForm.value.department == '' ){
      this._Router.navigateByUrl(`/destination/${this.admissionForm.value.destination}`)

    }else if(this.admissionForm.value.faculty == '' && this.admissionForm.value.major == '' && this.admissionForm.value.department == '' ){
      this._Router.navigateByUrl(`/university/${this.admissionForm.value.destination}/${this.admissionForm.value.university}`)

    }else{
      this._Router.navigateByUrl(`/faculty/${this.admissionForm.value.faculty}/${this.admissionForm.value.university}`)

    }
  }
  onChangeDestination(event: any , lang: string) {
    this.onChangeDestinationLoader = true;
    this._DependentFormService.getUniversities(event.target.value , lang).subscribe(
      (response) => {
        this.changeUniversities = response.universities[0];
        this.onChangeDestinationLoader = false;

      }
    )
    this.universityChoice = true;
  }
  onChangeUniversity(event: any, lang: string) {
    this.onChangeUniversityLoader = true;
    this._DependentFormService.getFaculty(event.target.value, lang).subscribe(
      (response) => {
        this.changeFaculty = response.faculties[0];
        this.onChangeUniversityLoader = false;

      }
    )
    this.universityOnchangeId = event.target.value
    this.facultyChoice = true;
  }
  onChangeFaculty(event: any, lang: string) {

    this.onChangeFacultyLoader = true;
    this._DependentFormService.getMajors(this.admissionForm.value.universitySlug, event.target.value , lang).subscribe(
      (response) => {
        this.changeMajor = response.majors[0]
        this.onChangeFacultyLoader = false;

      }
    )

    this.majorChoice = true;
  }
  onMajorSaerch(event: any, lang: string){
    this.onChangeMajorLoader = true;
    this._DependentFormService.getDepartments(event.target.value , lang).subscribe(
      (response) => {
        this.changeDepartment = response.departments[0]
        this.onChangeMajorLoader = false;
        this.departmentChoice = true;
      }

    )
  }
}
