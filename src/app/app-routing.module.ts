import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseComponent } from './course/course.component';
import { CoursesComponent } from './courses/courses.component';
import { SubjectsComponent } from './subjects/subjects.component';
import { ChaptersComponent } from './chapters/chapters.component';
import { TopicsComponent } from './topics/topics.component';
import { ContentComponent } from './content/content.component';
import { HomeComponent } from './home/home.component';
import { AuthComponent } from './auth/auth.component';

const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'auth', component: AuthComponent },
    { path: 'create-course', component: CourseComponent },
    { path: 'courses', component: CoursesComponent },
  {
        path: 'courses/:course_id',
        children: [
              { path: 'subjects', component: SubjectsComponent },
            {
                path: 'subjects/:subject_id',
                children: [
                    { path: 'chapters', component: ChaptersComponent },
                    {
                        path: 'chapters/:chapter_id',
                        children: [
                           { path: 'topics', component: TopicsComponent },
                            {
                                path: 'topics/:topic_id',
                                children: [
                                    { path: 'content', component: ContentComponent }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
     { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', redirectTo: '/home' } // Redirect to home if route does not match
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }