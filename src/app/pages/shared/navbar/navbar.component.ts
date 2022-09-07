import { Component, OnInit, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HomeService } from 'src/app/services/home.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  toggleSidebar: boolean = true;
  currentLanguage:any;
  show:boolean=true;
  currentLang:any;
  currentUsername: any;
  isLogined: boolean = false;
  destinations: any[] =[];
  AcademicData!:boolean;
  userArray: any;
  userPersonalInfo: any;
  paperStatus!: any;
    constructor(
    private _Renderer2:Renderer2,
    public _TranslateService:TranslateService,
    private _AuthenticationService:AuthenticationService,
    private _HomeService:HomeService
  ) { }

  closeSidebar(){
    let sidebar = document.querySelector('#sidebar');
    this._Renderer2.addClass(sidebar, 'left');
    this.toggleSidebar = false;
  }
  openSidebar(){
    let sidebar = document.querySelector('#sidebar');
    this._Renderer2.removeClass(sidebar, 'left');
    this.toggleSidebar = true;

  }

  // showPaperInfo(){
  //   this._AuthenticationService.getPaperInfo(this.userArray.id).subscribe(
  //     (response) => {
  //       console.log(response);
  //       console.log(response.message);

  //       this.paperStatus = response;

  //     }
  //   )
  // }
  openNavbar(){
    let bodyOverlay = document.querySelector('.body-overlay');
    let sidebarArea = document.querySelector('.sidebar__area ');
    this._Renderer2.addClass(bodyOverlay , 'opened')
    this._Renderer2.addClass(sidebarArea , 'sidebar-opened')
  }
  closeNavbar(){
    let bodyOverlay = document.querySelector('.body-overlay');
    let admissionCard = document.querySelector('.admission__card');

    let sidebarArea = document.querySelector('.sidebar__area ');
    this._Renderer2.removeClass(bodyOverlay , 'opened')
    this._Renderer2.removeClass(sidebarArea , 'sidebar-opened')
    this._Renderer2.removeClass(admissionCard , 'admission__card--opened')
  }
  openAdmissionForm(){
    let admissionCard = document.querySelector('.admission__card');
    let bodyOverlay = document.querySelector('.body-overlay');
    this._Renderer2.addClass(admissionCard ,'admission__card--opened')
    this._Renderer2.addClass(bodyOverlay ,'opened')
  }

  ngOnInit(): void {
    this.authentication();
    this.showDestination();
    // this.showPaperInfo();
    let navbar = document.querySelector('.header__area');
    let sidebar = document.querySelector('#sidebar');
    let btnUp = document.querySelector('.progress-wrap');
    this._Renderer2.listen(window,'scroll', ($event) => {

      if(window.scrollY > 300){
        this._Renderer2.addClass(navbar, 'sticky')
      }else{
        this._Renderer2.removeClass(navbar, 'sticky')

      }
    })

    this._Renderer2.listen(window,'scroll', ($event) => {


      if(window.scrollY > 850){
        this._Renderer2.addClass(sidebar, 'active')
        this._Renderer2.addClass(btnUp, 'active-progress')
      }else{
        this._Renderer2.removeClass(sidebar, 'active')
        this._Renderer2.removeClass(btnUp, 'active-progress')


      }
    })


    this.currentLanguage = localStorage.getItem("currentLanguage") || 'ar'
    this._TranslateService.use(this.currentLanguage);
    this._TranslateService.onLangChange.subscribe(
      () => {
        this.currentLanguage = this._TranslateService.currentLang
      }
    )
  }
  onClickLi(){
    let li = document.querySelector('.destination_li');
    this._Renderer2.addClass(li , 'close_li');
  }
  mouseEnter(){
    let li = document.querySelector('.destination_li');
    this._Renderer2.removeClass(li , 'close_li');
  }


  showDestination(){
    this._HomeService.getHomeData().subscribe(
      (response) => {
        this.destinations = response.destinations
      }
    )
  }
  showcurrentLanguage(language:any){
    this._TranslateService.use(language);
    localStorage.setItem("currentLanguage",language)
  }
  authentication(){
    this._AuthenticationService.currentUserData.subscribe(() => {
      if (this._AuthenticationService.currentUserData.getValue() == null) {
        this.isLogined = false;
      } else {
        this.userArray = JSON.parse(
          localStorage.getItem('currentUserArray') || '{}'
        );
          this._AuthenticationService
            .getPersonalInformation(this.userArray.id)
            .subscribe((response) => {
              console.log(response);
              this.userPersonalInfo = response.userPersonalInfo;
              if(response.userPersonalInfo?.full_name == null){
                this.AcademicData = false
                console.log("false");
              }else{
                this.AcademicData = true
                console.log("true");
                this._AuthenticationService.getPaperInfo(this.userArray.id).subscribe(
                  (response) => {
                    console.log(response);
                    console.log(response.message);

                    this.paperStatus = response;

                  }
                )
              }
            });



        this.isLogined = true;
      }
    });
  }
    logout(){
      this._AuthenticationService.signOut();
    }
}
