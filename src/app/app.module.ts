// import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';

// import { AppRoutingModule } from './app-routing.module';
// import { AppComponent } from './app.component';
// import { CourseComponent } from './course/course.component';
// import { CoursesComponent } from './courses/courses.component';
// import { SubjectsComponent } from './subjects/subjects.component';
// import { ModulesComponent } from './modules/modules.component';
// import { ChaptersComponent } from './chapters/chapters.component';
// import { TopicsComponent } from './topics/topics.component';
// import { SubtopicsComponent } from './subtopics/subtopics.component';
// import { ContentComponent } from './content/content.component';
// import {FormsModule} from "@angular/forms";

// @NgModule({
//   declarations: [
//     AppComponent,
//     CourseComponent,
//     CoursesComponent,
//     SubjectsComponent,
//     ModulesComponent,
//     ChaptersComponent,
//     TopicsComponent,
//     SubtopicsComponent,
//     ContentComponent
//   ],
//     imports: [
//         BrowserModule,
//         AppRoutingModule,
//         FormsModule
//     ],
//   providers: [],
//   bootstrap: [AppComponent]
// })
// export class AppModule { }

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { CourseComponent } from './course/course.component';
import { CoursesComponent } from './courses/courses.component';
import { SubjectsComponent } from './subjects/subjects.component';
import { ModulesComponent } from './modules/modules.component';
import { ChaptersComponent } from './chapters/chapters.component';
import { TopicsComponent } from './topics/topics.component';
import { SubtopicsComponent } from './subtopics/subtopics.component';
import { ContentComponent } from './content/content.component';

import { AppRoutingModule } from './app-routing.module'; // Import AppRoutingModule
import { CourseService } from './services/course.service';
import { MarkdownModule } from 'ngx-markdown';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SubjectsModulesComponent } from './subjects-modules/subjects-modules.component';
import { ChaptersTopicsComponent } from './chapters-topics/chapters-topics.component';
import { SubtopicsContentComponent } from './subtopics-content/subtopics-content.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthComponent } from './auth/auth.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MermaidAPI } from 'ngx-markdown';
import { MermaidViewComponent } from './mermaid-view/mermaid-view.component';


@NgModule({
  declarations: [
    AppComponent,
    CourseComponent,
    CoursesComponent,
    SubjectsComponent,
    ModulesComponent,
    ChaptersComponent,
    TopicsComponent,
    SubtopicsComponent,
    ContentComponent,
    HomeComponent,
    FooterComponent,
    SubjectsModulesComponent,
    ChaptersTopicsComponent,
    SubtopicsContentComponent,
    LoginComponent,
    RegisterComponent,
    AuthComponent,
    MermaidViewComponent,
    

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    FontAwesomeModule,

    MarkdownModule.forRoot(),


    // Add AppRoutingModule here
  ],
  providers: [CourseService, provideAnimationsAsync()],
  bootstrap: [AppComponent]
})
export class AppModule { }

