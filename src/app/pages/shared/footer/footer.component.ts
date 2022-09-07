import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { of } from 'rxjs';
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
  currentLanguage: any;
  selectedValue?: string;
  selectedOption: any;
  previewOption?: any;
  constructor(
    private _HomeService: HomeService,
    private _TranslateService: TranslateService,
    private _Router: Router
  ) {}

  onSelect(event: TypeaheadMatch): void {
    this.selectedOption = event.item;
    console.log(event);
    if (event.item.en_about_the_destination) {
      this._Router.navigate(['/destination/', event.item.id]);
    } else if (event.item.special_id) {
      this._Router.navigate([`/faculty/${event.item.faculty_id}/${event.item.university_id}`]);
    } else if (event.item.en_about_the_university) {
      this._Router.navigate(['/university/', event.item.id]);
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
    this._HomeService.getHomeData().subscribe((response) => {
      this.faculties = response.faculty;
      const facultyArray = this.faculties.map(v => ({ ...v, ...response.facultyUniversity.find((sp:any) => sp.university_id === v.id) }));

      this.universities = response.university;
      this.destinations = response.destinations;

      this.arrayOfAll = this.universities.concat(
        this.universities,
        this.destinations,
        facultyArray
      );
    });
  }
  translateFunction() {
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
