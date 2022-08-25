import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule} from '@angular/common/http'
import ar from '@angular/common/locales/ar';

import en from '@angular/common/locales/en';
import { registerLocaleData } from '@angular/common';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Angular material
import { AngularMaterialModule } from './material.module';
import { HomeComponent } from './pages/content/home/home.component';
import { NavbarComponent } from './pages/shared/navbar/navbar.component';
import { FooterComponent } from './pages/shared/footer/footer.component';
import { NotfoundComponent } from './pages/shared/notfound/notfound.component';
import { AboutUsComponent } from './pages/content/about-us/about-us.component'
import { CarouselModule } from 'ngx-owl-carousel-o';
import { SwiperModule } from "swiper/angular";
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgwWowModule } from 'ngx-wow';
import { CountUpModule } from 'ngx-countup';
import { ContactUsComponent } from './pages/content/contact-us/contact-us.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { PopoverModule } from "ngx-bootstrap/popover";
import { LoginComponent } from './pages/content/auth/login/login.component';
import { RegisterComponent } from './pages/content/auth/register/register.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { ToastrModule } from "ngx-toastr";
registerLocaleData(ar)
registerLocaleData(en)

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    FooterComponent,
    NotfoundComponent,
    AboutUsComponent,
    ContactUsComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularMaterialModule,
    TranslateModule.forRoot({
      defaultLanguage: 'ar',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    BrowserAnimationsModule,
    CarouselModule,
    CountUpModule,
    NgwWowModule,
    NgxSkeletonLoaderModule,
    SwiperModule,
    SweetAlert2Module,
    PopoverModule.forRoot(),
    NgxIntlTelInputModule,
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
export function HttpLoaderFactory(_HttpClient:HttpClient){
  return new TranslateHttpLoader(_HttpClient , './assets/i18n/','.json')
}
