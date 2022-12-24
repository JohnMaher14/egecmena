import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { HomeService } from 'src/app/services/home.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent implements OnInit {
  loading!:boolean;
  university:any;
  faculty:any;
  currentLanguage: any;
  term: any;
  departmentFaculty: any[] = [];
  faculties: any[] = [];
  universities: any[] = [];
  facultyImage:string = `${environment.imageUrl}faculties/`;

  constructor(
    private _HomeService:HomeService,
    private _ActivatedRoute:ActivatedRoute,
    private _TranslateService:TranslateService
  ) { }

  ngOnInit(): void {
    this.showDepartments();
    this.translateFunction();

  }
  showDepartments(){
    this._ActivatedRoute.paramMap.subscribe(
      (params:Params) => {
        this.loading = true;
        this._HomeService.getHomeData().subscribe(
          (response) => {
            this.faculties = response.faculty;
            this.universities = response.university;
            const departmentArray = response.Department.filter(
              (response:any) => {
                return response.id == params['params'].faculty_major_university_id
              }
            )
            this.departmentFaculty = departmentArray;
            this.departmentFaculty.forEach(
              (array:any) => {

                return array.faculty_university.faculty = this.faculties.filter(
                  (facultyResponse) => {
                    return facultyResponse.id == array.faculty_university.faculty_id;
                  }
                )
              }
            )
            this.departmentFaculty.forEach(
              (universityArray) => {
                return universityArray.faculty_university.university = this.universities.filter(
                  (universityResponse) => {
                    return universityResponse.id == universityArray.faculty_university.university_id;
                  }
                )
              }
            )
            this.faculty = this.departmentFaculty;
            this.loading = false;
          }
        )

      }
    )
  }
  translateFunction(){
    this.currentLanguage = localStorage.getItem("currentLanguage") || 'ar'
    this._TranslateService.use(this.currentLanguage)
    this._TranslateService.onLangChange.subscribe(
      () => {

        this.currentLanguage = this._TranslateService.currentLang
      }
    )
  }
}
