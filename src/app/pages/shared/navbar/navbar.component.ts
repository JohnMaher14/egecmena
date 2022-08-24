import { Component, OnInit, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  toggleSidebar: boolean = true;
  currentLanguage:any
  show:boolean=true;
  currentLang:any;
    constructor(
    private _Renderer2:Renderer2,
    public _TranslateService:TranslateService
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
  openNavbar(){
    let bodyOverlay = document.querySelector('.body-overlay');
    let sidebarArea = document.querySelector('.sidebar__area ');
    this._Renderer2.addClass(bodyOverlay , 'opened')
    this._Renderer2.addClass(sidebarArea , 'sidebar-opened')
  }
  closeNavbar(){
    let bodyOverlay = document.querySelector('.body-overlay');
    let sidebarArea = document.querySelector('.sidebar__area ');
    this._Renderer2.removeClass(bodyOverlay , 'opened')
    this._Renderer2.removeClass(sidebarArea , 'sidebar-opened')
  }
  ngOnInit(): void {
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


    this.currentLang = localStorage.getItem("currentLanguage") || 'en'
    this._TranslateService.use(this.currentLang);
    this._TranslateService.onLangChange.subscribe(
      () => {
        this.currentLanguage = this._TranslateService.currentLang
      }
    )
  }
  showcurrentLanguage(language:any){
    this._TranslateService.use(language);
    localStorage.setItem("currentLanguage",language)
    }
}
