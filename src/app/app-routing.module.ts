import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutUsComponent } from './pages/content/about-us/about-us.component';
import { AcademicInformationComponent } from './pages/content/auth/academic-information/academic-information.component';
import { LoginComponent } from './pages/content/auth/login/login.component';
import { MovementInformationComponent } from './pages/content/auth/movement-information/movement-information.component';
import { PersonalInformationComponent } from './pages/content/auth/personal-information/personal-information.component';
import { RegisterComponent } from './pages/content/auth/register/register.component';
import { BlogDetailsComponent } from './pages/content/blog-details/blog-details.component';
import { ContactUsComponent } from './pages/content/contact-us/contact-us.component';
import { DestinationComponent } from './pages/content/destination/destination.component';
import { DestinationsComponent } from './pages/content/destinations/destinations.component';
import { FacultyComponent } from './pages/content/faculty/faculty.component';
import { HomeComponent } from './pages/content/home/home.component';
import { StudyByFacultyUniversityComponent } from './pages/content/study-by-faculty-university/study-by-faculty-university.component';
import { StudyByFacultyComponent } from './pages/content/study-by-faculty/study-by-faculty.component';
import { UniversitiesComponent } from './pages/content/universities/universities.component';
import { NotfoundComponent } from './pages/shared/notfound/notfound.component';
import { AuthenticationGuard } from './services/authentication.guard';

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '', component: HomeComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'personal-information', canActivate: [AuthenticationGuard] , component: PersonalInformationComponent },
  { path: 'academic-information', canActivate: [AuthenticationGuard] , component: AcademicInformationComponent },
  { path: 'movement-information', canActivate: [AuthenticationGuard],  component: MovementInformationComponent },
  { path: 'studyByFaculty/:id', component: StudyByFacultyComponent },
  { path: 'studyByFacultyUniversity/:special_id/:faculty_id', component: StudyByFacultyUniversityComponent },
  { path: 'destinations', component: DestinationsComponent },
  { path: 'destination/:slug', component: DestinationComponent },
  { path: 'university/:id', component: UniversitiesComponent },
  { path: 'blog' , component: BlogDetailsComponent },
  { path: 'faculty/:faculty_id/:university_id', component: FacultyComponent },
  { path:'**' , component: NotfoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes , { useHash: true , scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
