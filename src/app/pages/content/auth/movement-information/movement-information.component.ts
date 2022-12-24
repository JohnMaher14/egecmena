import { Component, OnInit , Renderer2 } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AdmissionFormComponent } from 'src/app/pages/shared/admission-form/admission-form.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-movement-information',
  templateUrl: './movement-information.component.html',
  styleUrls: ['./movement-information.component.scss'],
  providers:[AdmissionFormComponent]
})
export class MovementInformationComponent implements OnInit {

  currentLanguage: any;
  userArray: any;
  userPersonalInfo: any;
  userAcademicInfo: any;
  isLogined!: boolean;
  actionLoading!:boolean;
  paperPending!:any;
  paperMessage: any
  loading!:boolean;
  constructor(
    private _TranslateService: TranslateService,
    private _Title: Title,
    private _Router: Router,
    private _AuthenticationService: AuthenticationService,
    private _ToastrService:ToastrService,
    private _UserService:UserService,
    private _Renderer2:Renderer2
  ) {}

  ngOnInit(): void {
    this.translateFunction();
    this.authenticationData();
    this.showPersonalInformation();
    this.showPaperInfo();
    this.loader()
    if(this.paperPending?.pending != 'Academic Guide still not assigned to you... please wait'){
      this._Router.navigate(['/']);
    }
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
  firstPaper: FormGroup = new FormGroup({
    'passport': new FormControl('', Validators.required),
    'secondary_certificate': new FormControl('', Validators.required),
    'birth_certificate': new FormControl('', Validators.required),
    'user_id': new FormControl(''),
  });
  secondPaper: FormGroup = new FormGroup({
    'diploma': new FormControl('', Validators.required),
    'authorization': new FormControl('', Validators.required),
    'image': new FormControl('', Validators.required),
    'last_document': new FormControl('', Validators.required),
    'user_id': new FormControl(''),
  });

  // image onchange
  onChangePassport(event:any){
    const file = event.target.files ? event.target.files[0] : '';
    this.firstPaper.patchValue({
      passport: file
    })
    this.firstPaper.get('passport')?.updateValueAndValidity()

  }
  // image onchange
  onChangeBirthCertificate(event:any){
    const file = event.target.files ? event.target.files[0] : '';
    this.firstPaper.patchValue({
      birth_certificate: file
    })
    this.firstPaper.get('birth_certificate')?.updateValueAndValidity()

  }
  // image onchange
  onChangeSecondaryCertificate(event:any){
    const file = event.target.files ? event.target.files[0] : '';
    this.firstPaper.patchValue({
      secondary_certificate: file
    })
    this.firstPaper.get('secondary_certificate')?.updateValueAndValidity()

  }
  // image onchange
  onChangeDiploma(event:any){
    const file = event.target.files ? event.target.files[0] : '';
    this.secondPaper.patchValue({
      diploma: file
    })
    this.firstPaper.get('diploma')?.updateValueAndValidity()

  }
  // image onchange
  onChangeAuthorization(event:any){
    const file = event.target.files ? event.target.files[0] : '';
    this.secondPaper.patchValue({
      authorization: file
    })
    this.firstPaper.get('authorization')?.updateValueAndValidity()

  }
  // image onchange
  onChangeImage(event:any){
    const file = event.target.files ? event.target.files[0] : '';
    this.secondPaper.patchValue({
      image: file
    })
    this.firstPaper.get('image')?.updateValueAndValidity()

  }
  // image onchange
  onChangeLastDocument(event:any){
    const file = event.target.files ? event.target.files[0] : '';
    this.secondPaper.patchValue({
      last_document: file
    })
    this.firstPaper.get('last_document')?.updateValueAndValidity()

  }
  onSubmitFirstPaper(
    firstPaper:FormGroup
  ) {
    console.log(firstPaper);
    this._UserService.submitFirstPaperMovement(
      this.firstPaper.value.passport,
      this.firstPaper.value.secondary_certificate,
      this.firstPaper.value.birth_certificate,
      this.userArray.id
    ).subscribe(
      (response) => {
        console.log(response);

        if(response.success){
          if(this.currentLanguage === 'ar'){
            this._ToastrService.success(`${response.ar_success}` , `ارسال صحيح`,
            { timeOut: 6000 , positionClass: 'toast-bottom-center'
          })

          }else{
            this._ToastrService.success(`${response.success}` , `Succssefully sent`,
            { timeOut: 6000 , positionClass: 'toast-bottom-center'
          })
          }
          this._TranslateService.onLangChange.subscribe
          ((language) => {
            if(language.lang === 'ar'){
              this._ToastrService.success(`${response.ar_success}` , `ارسال صحيح`,
              { timeOut: 6000 , positionClass: 'toast-bottom-center'
            })

            }else{
              this._ToastrService.success(`${response.success}` , `Succssefully sent`,
              { timeOut: 6000 , positionClass: 'toast-bottom-center'
            })
            }
          })
        }
      }
    )
    // console.log(firstPaper.value);
    // this.actionLoading = true;

  }
  onSubmitSecondPaper(
    secondPaper:FormGroup
  ) {
    console.log(secondPaper);
    this._UserService.submitSecondPaperMovement(
      this.secondPaper.value.diploma,
      this.secondPaper.value.authorization,
      this.secondPaper.value.image,
      this.secondPaper.value.last_document,
      this.userArray.id
    ).subscribe(
      (response) => {
        if(this.currentLanguage === 'ar'){
          this._ToastrService.success(`${response.ar_success}` , `ارسال صحيح`,
          { timeOut: 6000 , positionClass: 'toast-bottom-center'
        })

        }else{
          this._ToastrService.success(`${response.success}` , `Succssefully sent`,
          { timeOut: 6000 , positionClass: 'toast-bottom-center'
        })
        }
        this._TranslateService.onLangChange.subscribe
        ((language) => {
          if(language.lang === 'ar'){
            this._ToastrService.success(`${response.ar_success}` , `ارسال صحيح`,
            { timeOut: 6000 , positionClass: 'toast-bottom-center'
          })

          }else{
            this._ToastrService.success(`${response.success}` , `Succssefully sent`,
            { timeOut: 6000 , positionClass: 'toast-bottom-center'
          })
          }
        })
      }
    )
    // console.log(firstPaper.value);
    // this.actionLoading = true;

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
  showPaperInfo(){
    this._UserService.getPaperInfo(this.userArray.id).subscribe(
      (response) => {
        console.log(response);
        this.paperMessage = response.message
        if(response.pending){
          this.paperPending = response;
        }

      }
    )
  }
  translateFunction() {
    this.currentLanguage = localStorage.getItem('currentLanguage') || 'ar';
    this._TranslateService.use(this.currentLanguage);
    if (this.currentLanguage == 'en') {
      this._Title.setTitle(`${environment.title}Paper movement`);
    } else if (this.currentLanguage == 'ar') {
      this._Title.setTitle(`${environment.title} حركة الملفات`);
    }
    this._TranslateService.onLangChange.subscribe((language) => {
      if (language.lang == 'en') {
        this._Title.setTitle(`${environment.title}Paper movement`);
      } else if (language.lang == 'ar') {
        this._Title.setTitle(`${environment.title} حركة الملفات`);
      }
      this.currentLanguage = this._TranslateService.currentLang;
    });
  }

}
