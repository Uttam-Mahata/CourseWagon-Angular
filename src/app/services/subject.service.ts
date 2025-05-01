import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';
import { CourseService } from './course.service';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  private apiUrl = environment.courseApiUrl;
  
  constructor(
    private http: HttpClient,
    private courseService: CourseService
  ) {
    console.log('SubjectService initialized');
  }
  
  // Get subject details by ID
  getSubjectDetails(courseId: number, subjectId: number): Observable<any> {
    console.log(`Fetching subject details for course: ${courseId}, subject: ${subjectId}`);
    return this.http.get(`${this.apiUrl}/${courseId}/subjects/${subjectId}`);
  }
  
  // Generate subjects for a course
  generateSubjects(courseId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${courseId}/generate_subjects`, {}).pipe(
      tap(() => {
        // Update the course cache to show it has subjects
        this.courseService.updateCourseHasSubjects(courseId);
      })
    );
  }
  
  // Get all subjects for a course
  getSubjects(courseId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${courseId}/subjects`);
  }
}
