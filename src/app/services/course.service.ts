import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = environment.courseApiUrl;
  constructor(private http: HttpClient) { }

  addCourse(name: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/courses/add_course`, { name });
  }

  getCourses(): Observable<any> {
    return this.http.get(`${this.apiUrl}/courses`);
  }

  getCourseDetails(courseId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/courses/${courseId}`);
  }
  generateSubjects(courseId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/courses/${courseId}/generate_subjects`, {});
  }
  
  getSubjects(courseId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/courses/${courseId}/subjects`);
  }

  generateChapters(courseId: number, subjectId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/courses/${courseId}/subjects/${subjectId}/generate_chapters`, {});
  }

  getChapters(courseId: number, subjectId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/courses/${courseId}/subjects/${subjectId}/chapters`);
  }

  generateTopics(courseId: number, subjectId: number, chapterId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/courses/${courseId}/subjects/${subjectId}/chapters/${chapterId}/generate_topics`, {});
  }

  getTopics(courseId: number, subjectId: number, chapterId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/courses/${courseId}/subjects/${subjectId}/chapters/${chapterId}/topics`);
  }
  getTopicDetails(courseId: number, subjectId: number, chapterId: number, topicId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/courses/${courseId}/subjects/${subjectId}/chapters/${chapterId}/topics/${topicId}`);
  }
  generateContent(courseId: number, subjectId: number, chapterId: number, topicId: number): Observable<any> {
      return this.http.post(`${this.apiUrl}/courses/${courseId}/subjects/${subjectId}/chapters/${chapterId}/topics/${topicId}/generate_content`, {});
  }

  getContent(courseId: number, subjectId: number, chapterId: number, topicId: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/courses/${courseId}/subjects/${subjectId}/chapters/${chapterId}/topics/${topicId}/content`);
  }

}