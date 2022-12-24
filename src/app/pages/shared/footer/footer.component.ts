import { Component, OnInit , Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { HomeService } from 'src/app/services/home.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  destinations: any[] = [];
  universities: any[] = [];
  faculties: any[] = [];
  arrayOfAll: any[] = [];
  departments: any[] = [];
  facultyUniversity: any[] = [];
  currentLanguage: any;
  selectedValue?: string;
  selectedOption: any;
  previewOption?: any;
  onReadySearchData:boolean = true;
  constructor(
    private _HomeService: HomeService,
    private _TranslateService: TranslateService,
    private _Router: Router,
    private _Renderer2:Renderer2
  ) {}

  onSelect(event: TypeaheadMatch): void {
    this.selectedOption = event.item;
    console.log(event.item);
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
    console.log(char);
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
    } else {
      this.previewOption = null;
    }
  }
  allData() {
    let footerSearchInput = document.querySelector('.footerSearchInput');
    this._Renderer2.setAttribute(footerSearchInput ,  'disabled' , 'disabled')
    this.onReadySearchData = true;
    this._HomeService.getHomeData().subscribe((response) => {
      this.faculties = response.faculty;
      this.universities = response.university;
      this.destinations = response.destinations;
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
      this._Renderer2.removeAttribute(footerSearchInput , 'disabled')
      this.onReadySearchData = false;

    });
  }
  translateFunction() {
    console.log(localStorage.getItem('currentLanguage'));
    this.currentLanguage = localStorage.getItem('currentLanguage') || 'ar';
    this._TranslateService.use(this.currentLanguage);
    this._TranslateService.onLangChange.subscribe(() => {
      this.currentLanguage = this._TranslateService.currentLang;
    });
  }
  ngOnInit(): void {
    this.allData();
    this.translateFunction();
  }
}
