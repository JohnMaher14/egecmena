import {
  AfterContentChecked,
  AfterViewChecked,
  Component,
  OnInit,
  Renderer2,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HomeService } from 'src/app/services/home.service';
import { StudyService } from 'src/app/services/study.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-faculty',
  templateUrl: './faculty.component.html',
  styleUrls: ['./faculty.component.scss'],
})
export class FacultyComponent implements OnInit {
  faculties: any[] = [];
  facultyData: any;
  facultyUniversity: any;
  facultyUniversities: any[] = [];
  destinations: any[] = [];
  otherFaculties: any[] = [];
  otherFacultiesSpecial: any[] = [];
  universityData: any;
  facultyDatas: any[] = [];
  conditions: any[] = [];
  majors: any[] = [];
  userArray: any;
  destinationDetail: any;
  specialId!: number;
  isLogined!: boolean;
  userPersonalInfo: any;
  userAcademicInfo: any;
  universityImage: string = `${environment.imageUrl}universities/`;
  facultyImage: string = `${environment.imageUrl}faculties/`;
  destinationImage: string = `${environment.imageUrl}destinations/`;
  currentLanguage: any;
  actionLoading!: boolean;
  loading!: boolean;
  alertStatus:boolean = true;
  constructor(
    private _StudyService: StudyService,
    private _ActivatedRoute: ActivatedRoute,
    private _TranslateService: TranslateService,
    private _AuthenticationService: AuthenticationService,
    private _Title: Title,
    private _UserService: UserService,
    private _ToastrService: ToastrService,
    private _Renderer2:Renderer2,
    private _Router:Router
  ) {}

  ngOnInit(): void {
    this.translateFunction();
    this.authenticationData();
    this.showPersonalInformation();
    this.showAcademicInformation();
    this.showUniversities();
    // this.showDestination();
  }
  showUniversities() {
    this._ActivatedRoute.paramMap.subscribe((params: Params) => {
      let body = document.querySelector('body');
      this._Renderer2.setStyle(body, 'overflow' , 'hidden')
      this.loading = true;
      this._StudyService
        .getFacultyData(
          params['params'].faculty_slug,
          params['params'].university_slug,
          this.currentLanguage
        )
        .subscribe((response) => {
          this.specialId = response.facultyData.special_id;
            this._StudyService.getDestinations().subscribe(
              (data) => {
                const destinations = data.destinations.filter(
                  (destination: any) => {
                    return destination.id = response.university?.destination_id
                  }
                )
                this.destinationDetail =  destinations[0]
              }
            )

          this.facultyData = response.facultyData;
          this.facultyUniversity = response.facultyUniversity;
          // this.facultyDatas = response.facultyDatas;
          this.conditions = response.mejorData;
          this.universityData = response.university;
          // this._StudyService.getUniversityFaculty(this.universityData?.id).subscribe(
          //   (response) => {
          //     const otherFacultyContainer = response.Faculties.filter((faculty: any) => {
          //       return faculty.faculty.en_slug != params['params'].faculty_slug && faculty.faculty.special_id == this.specialId;
          //     });

          //     function func() {
          //       return 0.5 - Math.random();
          //     }
          //     otherFacultyContainer.sort(func)

          //     this.otherFacultiesSpecial = otherFacultyContainer;
          //   }
          // )
          this._StudyService.studyByFaculty(this.specialId).subscribe(
            (response) => {
              const universityArray = response.faculty.filter(
                (responseData:any) => {
                  return responseData.id == this.facultyData?.id;
                }

              )
              const universitiesFilter = universityArray[0].universities.filter(
                (filterData: any) => {
                  return filterData.en_slug != this.universityData?.en_slug
                }
              )
              function func() {
                return 0.5 - Math.random();
              }
              universitiesFilter.sort(func)
              this.otherFacultiesSpecial = universitiesFilter;
              console.log(universitiesFilter);
              console.log(response);
            })
          this._StudyService.getMejorDepartments(this.universityData?.id , this.facultyData?.id).subscribe(
            (response) => {
              this.majors =  response.mejorData;
              this.loading = false;

            }
          )
          this._StudyService.getFacultyAllData(this.facultyUniversity?.id).subscribe(
            (response) => {
              this.facultyDatas = response.facultyData;
              this.loading = false;

            }
          )
          this._Renderer2.removeStyle(body, 'overflow')
          if (this.currentLanguage == 'en') {
            this._Title.setTitle(
              `${environment.title}${this.facultyData?.en_name}`
            );
          } else if (this.currentLanguage == 'ar') {
            this._Title.setTitle(
              `${environment.title}${this.facultyData?.ar_name}`
            );
          }
          this._TranslateService.onLangChange.subscribe(
            (language:any) => {
              if (language.lang == 'en') {
                this._Title.setTitle(
                  `${environment.title}${this.facultyData?.en_name}`
                );
                this._Router.navigate([`/faculty` , this.facultyData?.en_slug , this.universityData?.en_slug])
              } else if (language.lang == 'ar') {
                this._Title.setTitle(
                  `${environment.title}${this.facultyData?.ar_name}`
                );
                this._Router.navigate([`/faculty` , this.facultyData?.ar_slug , this.universityData?.ar_slug ])

              }
            }
          )

        });

    });
  }
  closeAlert(id:number){
    this.alertStatus = false
  }
  registerForm: FormGroup = new FormGroup({
    destination: new FormControl('', Validators.required),
    university: new FormControl('', Validators.required),
    faculty: new FormControl('', Validators.required),
    page: new FormControl('ss', Validators.required),
    user_id: new FormControl('', Validators.required),
  });

  onRegister(registerForm: FormGroup) {

    this._UserService
      .submitAdmissionInformation(registerForm.value)
      .subscribe((response) => {
        // if (this.currentLanguage === 'en') {
        //   this._ToastrService.success(`${response.success}`, `success`);
        // } else if (this.currentLanguage === 'ar') {
        //   this._ToastrService.success(`${response.ar_success}`, `تسجيل صحيح`);
        // }
        if(response.success === 'You registered before and we will call you soon'){
          if(this.currentLanguage === 'en'){
            this._ToastrService.warning(`${response.success}`,`Attention` , {
              timeOut: 6000 , positionClass: 'toast-bottom-center'

            })

            this.actionLoading = false;
          }else if(this.currentLanguage === 'ar'){
            this._ToastrService.warning(`${response.ar_success}`,`تنبيه`, {
              timeOut: 6000 , positionClass: 'toast-bottom-center'

            })
            this.actionLoading = false;
          }
          this._TranslateService.onLangChange.subscribe(
            (language) => {
              if(language.lang === 'en'){
                this._ToastrService.warning(`${response.success}`,`success` , {
                  timeOut: 6000 , positionClass: 'toast-bottom-center'

                })

                this.actionLoading = false;
              }else if(language.lang === 'ar'){
                this._ToastrService.warning(`${response.ar_success}`,`تسجيل صحيح` , {
                  timeOut: 6000 , positionClass: 'toast-bottom-center'

                })
                this.actionLoading = false;
              }
            }
          )
        }else{
          if(this.currentLanguage === 'en'){
            this._ToastrService.success(`${response.success}`,`success` , {
              timeOut: 6000 , positionClass: 'toast-bottom-center'

            })

            this.actionLoading = false;
          }else if(this.currentLanguage === 'ar'){
            this._ToastrService.success(`${response.ar_success}`,`تسجيل صحيح` , {
              timeOut: 6000 , positionClass: 'toast-bottom-center'

            })
            this.actionLoading = false;
          }
          this._TranslateService.onLangChange.subscribe(
            (language) => {
              if(language.lang === 'en'){
                this._ToastrService.success(`${response.success}`,`success` , {
                  timeOut: 6000 , positionClass: 'toast-bottom-center'

                })

                this.actionLoading = false;
              }else if(language.lang === 'ar'){
                this._ToastrService.success(`${response.ar_success}`,`تسجيل صحيح` , {
                  timeOut: 6000 , positionClass: 'toast-bottom-center'

                })
                this.actionLoading = false;
              }
            }
          )

        }
      });
  }
  showPersonalInformation() {
    if (localStorage.getItem('currentUserToken') !== null) {
      this._UserService
        .getPersonalInformation(this.userArray.id)
        .subscribe((response) => {
          console.log(response);
          this.userPersonalInfo = response.userPersonalInfo;
        });
    }
  }
  showAcademicInformation() {
    if (localStorage.getItem('currentUserToken') !== null) {
      this._UserService
        .getAcademicInformation(this.userArray.id)
        .subscribe((response) => {
          console.log(response);
          this.userAcademicInfo = response;
        });
    }
  }
  translateFunction() {
    this.currentLanguage = localStorage.getItem('currentLanguage') || 'ar';
    this._TranslateService.use(this.currentLanguage);
    this._TranslateService.onLangChange.subscribe((language: any) => {
      this.currentLanguage = this._TranslateService.currentLang;
    });
  }

  authenticationData() {
    this._AuthenticationService.currentUserData.subscribe(() => {
      if (this._AuthenticationService.currentUserData.getValue() == null) {
        this.isLogined = false;
      } else {
        this.userArray = JSON.parse(
          localStorage.getItem('currentUserArray') || '{}'
        );

        this.isLogined = true;
      }
    });
  }
}
