import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseComponent } from './course/course.component';
import { CoursesComponent } from './courses/courses.component';
import { SubjectsComponent } from './subjects/subjects.component';
import { ModulesComponent } from './modules/modules.component';
import { ChaptersComponent } from './chapters/chapters.component';
import { TopicsComponent } from './topics/topics.component';
import { SubtopicsComponent } from './subtopics/subtopics.component';
import { ContentComponent } from './content/content.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'create-course', component: CourseComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'courses', component: CoursesComponent },
  { path: 'courses/:course_id/subjects', component: SubjectsComponent },
  { path: 'courses/:course_id/subjects/:subject_id/modules', component: ModulesComponent },
  { path: 'courses/:course_id/subjects/:subject_id/modules/:module_id/chapters', component: ChaptersComponent },
  { path: 'courses/:course_id/subjects/:subject_id/modules/:module_id/chapters/:chapter_id/topics', component: TopicsComponent },
  { path: 'courses/:course_id/subjects/:subject_id/modules/:module_id/chapters/:chapter_id/topics/:topic_id/subtopics', component: SubtopicsComponent },
  { path: 'courses/:course_id/subjects/:subject_id/modules/:module_id/chapters/:chapter_id/topics/:topic_id/subtopics/:subtopic_id/content', component: ContentComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
