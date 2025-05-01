import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { tap, map } from 'rxjs/operators';

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
  
  // Get subject details by ID
  getSubjectDetails(courseId: number, subjectId: number): Observable<any> {
    console.log(`Fetching subject details for course: ${courseId}, subject: ${subjectId}`);
    return this.http.get(`${this.apiUrl}/${courseId}/subjects/${subjectId}`);
  }
  
  // Get chapter details by ID
  getChapterDetails(courseId: number, subjectId: number, chapterId: number): Observable<any> {
    console.log(`Fetching chapter details for course: ${courseId}, subject: ${subjectId}, chapter: ${chapterId}`);
    return this.http.get(`${this.apiUrl}/${courseId}/subjects/${subjectId}/chapters/${chapterId}`);
  }
  
  // Get topic details by ID
  getTopicDetails(courseId: number, subjectId: number, chapterId: number, topicId: number): Observable<any> {
    console.log(`Fetching topic details for course: ${courseId}, subject: ${subjectId}, chapter: ${chapterId}, topic: ${topicId}`);
    return this.http.get(`${this.apiUrl}/${courseId}/subjects/${subjectId}/chapters/${chapterId}/topics/${topicId}`);
  }
  
  generateSubjects(courseId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${courseId}/generate_subjects`, {}).pipe(
      tap(() => {
        // Update the course in our cache to show it now has subjects
        const courses = this.myCoursesSubject.value;
        const course = courses.find(c => c.id === courseId);
        if (course) {
          course.has_subjects = true;
          this.myCoursesSubject.next([...courses]); // Trigger update with a new array reference
        }
      })
    );
  }
  
  getSubjects(courseId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${courseId}/subjects`);
  }
  
  generateChapters(courseId: number, subjectId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${courseId}/subjects/${subjectId}/generate_chapters`, {});
  }
  
  getChapters(courseId: number, subjectId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${courseId}/subjects/${subjectId}/chapters`);
  }
  
  generateTopics(courseId: number, subjectId: number, chapterId: number): Observable<any> {
    console.log(`Generating topics for course: ${courseId}, subject: ${subjectId}, chapter: ${chapterId}`);
    return this.http.post(`${this.apiUrl}/${courseId}/subjects/${subjectId}/chapters/${chapterId}/generate_topics`, {});
  }
  
  getTopics(courseId: number, subjectId: number, chapterId: number): Observable<any> {
    console.log(`Fetching topics for course: ${courseId}, subject: ${subjectId}, chapter: ${chapterId}`);
    return this.http.get(`${this.apiUrl}/${courseId}/subjects/${subjectId}/chapters/${chapterId}/topics`);
  }
  
  generateContent(courseId: number, subjectId: number, chapterId: number, topicId: number): Observable<any> {
    console.log(`Generating content for course: ${courseId}, subject: ${subjectId}, chapter: ${chapterId}, topic: ${topicId}`);
    return this.http.post(`${this.apiUrl}/${courseId}/subjects/${subjectId}/chapters/${chapterId}/topics/${topicId}/generate_content`, {});
  }
  
  getContent(courseId: number, subjectId: number, chapterId: number, topicId: number): Observable<any> {
    console.log(`Fetching content for course: ${courseId}, subject: ${subjectId}, chapter: ${chapterId}, topic: ${topicId}`);
    return this.http.get(`${this.apiUrl}/${courseId}/subjects/${subjectId}/chapters/${chapterId}/topics/${topicId}/content`);
  }
}