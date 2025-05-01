import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private apiUrl = environment.courseApiUrl;
  
  constructor(private http: HttpClient) {
    console.log('ContentService initialized');
  }
  
  // Generate content for a topic
  generateContent(courseId: number, subjectId: number, chapterId: number, topicId: number): Observable<any> {
    console.log(`Generating content for course: ${courseId}, subject: ${subjectId}, chapter: ${chapterId}, topic: ${topicId}`);
    return this.http.post(`${this.apiUrl}/${courseId}/subjects/${subjectId}/chapters/${chapterId}/topics/${topicId}/generate_content`, {});
  }
  
  // Get content for a topic
  getContent(courseId: number, subjectId: number, chapterId: number, topicId: number): Observable<any> {
    console.log(`Fetching content for course: ${courseId}, subject: ${subjectId}, chapter: ${chapterId}, topic: ${topicId}`);
    return this.http.get(`${this.apiUrl}/${courseId}/subjects/${subjectId}/chapters/${chapterId}/topics/${topicId}/content`);
  }
}
