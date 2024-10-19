// src/app/course.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private apiUrl = 'http://127.0.0.1:5000';  // Flask backend URL

  constructor(private http: HttpClient) { }

  // Add course to the backend
  addCourse(course: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add_course`, course);
  }

  // Get all courses from the backend
  getCourses(): Observable<any> {
    return this.http.get(`${this.apiUrl}/courses`);
  }
}
