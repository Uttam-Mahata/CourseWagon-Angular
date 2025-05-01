import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CoursesComponent } from './courses/courses.component';
import { CourseComponent } from './course/course.component';
import { AuthComponent } from './auth/auth.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from './auth.guard';
import { SubjectsChaptersComponent } from './subjects-chapters/subjects-chapters.component';
import { TopicsContentComponent } from './topics-content/topics-content.component';
import { SubjectListComponent } from './subject-list/subject-list.component';
import { CourseViewComponent } from './course-view/course-view.component';
import { TopicContentComponent } from './topic-content/topic-content.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'courses', component: CoursesComponent, canActivate: [AuthGuard] },
  { path: 'create-course', component: CourseComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  
  // Legacy routes
  { 
    path: 'courses/:course_id/subjects-chapters', 
    component: SubjectsChaptersComponent, 
    canActivate: [AuthGuard] 
  },
  {
    path: 'courses/:course_id/subjects/:subject_id/chapters/:chapter_id/topics/:topic_id/content',
    component: TopicsContentComponent,
    canActivate: [AuthGuard]
  },
  
  // New modular routes
  { 
    path: 'courses/:course_id/subjects', 
    component: SubjectListComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'courses/:course_id/subjects/:subject_id', 
    component: CourseViewComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'chapters/:chapter_id/topics/:topic_id',
        component: TopicContentComponent
      },
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full'
      }
    ]
  },
  
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
