import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseComponent } from './course/course.component';
import { CoursesComponent } from './courses/courses.component';
import { HomeComponent } from './home/home.component';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth.guard';
import { ProfileComponent } from './profile/profile.component';
import { SubjectsChaptersComponent } from './subjects-chapters/subjects-chapters.component';
import { TopicsContentComponent } from './topics-content/topics-content.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CourseContentComponent } from './course-content/course-content.component';
import { SubjectsComponent } from './subjects/subjects.component';
import { RouteRedirectResolver } from './route-redirect.resolver';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'create-course', component: CourseComponent, canActivate: [AuthGuard] },
  { path: 'courses', component: CoursesComponent, canActivate: [AuthGuard] },
  
  // New subjects component route
  { 
    path: 'courses/:course_id/subjects', 
    component: SubjectsComponent, 
    canActivate: [AuthGuard] 
  },
  
  // Legacy route - keep for compatibility
  { 
    path: 'courses/:course_id/subjects-chapters', 
    component: SubjectsChaptersComponent, 
    canActivate: [AuthGuard] 
  },
  
  // Course content routes
  { 
    path: 'courses/:course_id/subjects/:subject_id/content', 
    component: CourseContentComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'courses/:course_id/subjects/:subject_id/content/:topic_id', 
    component: CourseContentComponent,
    canActivate: [AuthGuard]
  },
  
  // Legacy routes - using resolver to handle redirects
  { 
    path: 'courses/:course_id/subjects/:subject_id/chapters/:chapter_id/topics', 
    resolve: { redirect: RouteRedirectResolver },
    component: SubjectsChaptersComponent,
    canActivate: [AuthGuard] 
  },
  {
    path: 'courses/:course_id/subjects/:subject_id/chapters/:chapter_id/topics/:topic_id/content',
    resolve: { redirect: RouteRedirectResolver },
    component: TopicsContentComponent,
    canActivate: [AuthGuard]
  },
  
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' } // Handle unknown routes
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
