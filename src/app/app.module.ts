import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http'
import ar from '@angular/common/locales/ar';

import en from '@angular/common/locales/en';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
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
import { TypeaheadModule } from "ngx-bootstrap/typeahead";
import { LoginComponent } from './pages/content/auth/login/login.component';
import { RegisterComponent } from './pages/content/auth/register/register.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { ToastrModule } from "ngx-toastr";
import { UniversitiesComponent } from './pages/content/universities/universities.component';
import { DestinationComponent } from './pages/content/destination/destination.component';
import { DestinationsComponent } from './pages/content/destinations/destinations.component';
import { FacultyComponent } from './pages/content/faculty/faculty.component';
import { PersonalInformationComponent } from './pages/content/auth/personal-information/personal-information.component';
import { AcademicInformationComponent } from './pages/content/auth/academic-information/academic-information.component';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { AuthenticationInterceptor } from './services/authentication.interceptor';
import { StudyByFacultyComponent } from './pages/content/study-by-faculty/study-by-faculty.component';
import { StudyByFacultyUniversityComponent } from './pages/content/study-by-faculty-university/study-by-faculty-university.component';
import { HomeLoaderComponent } from './pages/shared/home-loader/home-loader.component';
import { LoaderComponent } from './pages/shared/loader/loader.component';
import { ActionLoaderComponent } from './pages/shared/action-loader/action-loader.component';
import { AdmissionFormComponent } from './pages/shared/admission-form/admission-form.component';
import { MovementInformationComponent } from './pages/content/auth/movement-information/movement-information.component';
import { SearchUniversityPipe } from './pipes/search-university.pipe';
import { SearchDestinationPipe } from './pipes/search-destination.pipe';
import { InnerPageLoaderComponent } from './pages/shared/inner-page-loader/inner-page-loader.component';
import { BlogDetailsComponent } from './pages/content/blog-details/blog-details.component';
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
    RegisterComponent,
    UniversitiesComponent,
    DestinationComponent,
    DestinationsComponent,
    FacultyComponent,
    PersonalInformationComponent,
    AcademicInformationComponent,
    StudyByFacultyComponent,
    StudyByFacultyUniversityComponent,
    HomeLoaderComponent,
    LoaderComponent,
    ActionLoaderComponent,
    AdmissionFormComponent,
    MovementInformationComponent,
    SearchUniversityPipe,
    SearchDestinationPipe,
    InnerPageLoaderComponent,
    BlogDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularMaterialModule,
    FormsModule,
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
    ToastrModule.forRoot(),
    NgbModule,
    SelectDropDownModule,
    TypeaheadModule.forRoot(),

  ],
  providers: [
    {
      provide:HTTP_INTERCEPTORS,
      useClass:AuthenticationInterceptor,
      multi:true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
export function HttpLoaderFactory(_HttpClient:HttpClient){
  return new TranslateHttpLoader(_HttpClient , './assets/i18n/','.json')
}
