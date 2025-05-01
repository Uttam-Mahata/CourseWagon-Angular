import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppComponent } from './app.component';
import { CourseComponent } from './course/course.component';
import { CoursesComponent } from './courses/courses.component';
import { HomeComponent } from './home/home.component';
import { CourseViewComponent } from './course-view/course-view.component';
import { AppRoutingModule } from './app-routing.module';
import { CourseService } from './services/course.service';
import { MarkdownModule } from 'ngx-markdown';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthComponent } from './auth/auth.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MermaidViewComponent } from './mermaid-view/mermaid-view.component';
import { AuthInterceptor } from './auth.interceptor';
import { AuthGuard } from './auth.guard';
import { ProfileComponent } from './profile/profile.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SubjectsChaptersComponent } from './subjects-chapters/subjects-chapters.component';
import { TopicsContentComponent } from './topics-content/topics-content.component';
import { SharedMarkdownModule } from './shared/markdown.module';
import { SubjectListComponent } from './subject-list/subject-list.component';
import { TopicContentComponent } from './topic-content/topic-content.component';

@NgModule({
  declarations: [
    AppComponent,
    CourseComponent,
    CoursesComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    AuthComponent,
    MermaidViewComponent,
    ProfileComponent,
    NavbarComponent,
    HomeComponent,
    SubjectsChaptersComponent,
    TopicsContentComponent,
    CourseViewComponent,
    SubjectListComponent,
    TopicContentComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    FontAwesomeModule,
    MarkdownModule.forRoot(),
    SharedMarkdownModule,
    RouterModule,
  ],
  providers: [
    CourseService,
    provideAnimationsAsync(),
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

