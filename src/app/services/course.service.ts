import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment.prod';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = environment.courseApiUrl;
  
  // Create BehaviorSubjects to cache data and notify components when it changes
  private myCoursesSubject = new BehaviorSubject<any[]>([]);
  public myCourses$ = this.myCoursesSubject.asObservable();
  
  constructor(private http: HttpClient) {
    console.log('CourseService initialized with apiUrl:', this.apiUrl);
    // Initially load courses if user is logged in
    this.refreshMyCourses();
  }
  
  // Refresh the courses cache
  refreshMyCourses() {
    this.http.get<any[]>(`${this.apiUrl}/my-courses`).subscribe({
      next: (courses) => {
        this.myCoursesSubject.next(courses);
      },
      error: (error) => {
        console.error('Error fetching courses:', error);
      }
    });
  }
  
  addCourse(name: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/add_course`, { name }).pipe(
      tap(() => this.refreshMyCourses()) // Refresh the courses after adding one
    );
  }
  
  // Get all courses (public and user's own)
  getCourses(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
  
  // Get only user's courses - either from cache or fresh from backend
  getMyCourses(forceRefresh = false): Observable<any> {
    if (forceRefresh || this.myCoursesSubject.value.length === 0) {
      this.refreshMyCourses();
    }
    return this.myCourses$;
  }
  
  // Get course details by ID
  getCourseDetails(courseId: number): Observable<any> {
    console.log(`Fetching course details for ID: ${courseId}`);
    // First try to get from cache
    const cachedCourse = this.myCoursesSubject.value.find(c => c.id === courseId);
    if (cachedCourse) {
      return new Observable(observer => {
        observer.next(cachedCourse);
        observer.complete();
      });
    }
    // If not in cache, get from API
    return this.http.get(`${this.apiUrl}/${courseId}`);
  }
  
  // New CRUD operations
  createCourseManual(name: string, description: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-manual`, { name, description }).pipe(
      tap(() => this.refreshMyCourses()) 
    );
  }
  
  updateCourse(courseId: number, name: string, description?: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${courseId}`, { name, description }).pipe(
      tap(() => this.refreshMyCourses())
    );
  }
  
  deleteCourse(courseId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${courseId}`).pipe(
      tap(() => this.refreshMyCourses())
    );
  }
}