import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TopicService {
  private apiUrl = environment.courseApiUrl;
  
  constructor(private http: HttpClient) {
    console.log('TopicService initialized');
  }
  
  // Get topic details by ID
  getTopicDetails(courseId: number, subjectId: number, chapterId: number, topicId: number): Observable<any> {
    console.log(`Fetching topic details for course: ${courseId}, subject: ${subjectId}, chapter: ${chapterId}, topic: ${topicId}`);
    return this.http.get(`${this.apiUrl}/${courseId}/subjects/${subjectId}/chapters/${chapterId}/topics/${topicId}`);
  }
  
  // Generate topics for a chapter
  generateTopics(courseId: number, subjectId: number, chapterId: number): Observable<any> {
    console.log(`Generating topics for course: ${courseId}, subject: ${subjectId}, chapter: ${chapterId}`);
    return this.http.post(`${this.apiUrl}/${courseId}/subjects/${subjectId}/chapters/${chapterId}/generate_topics`, {});
  }
  
  // Get all topics for a chapter
  getTopics(courseId: number, subjectId: number, chapterId: number): Observable<any> {
    console.log(`Fetching topics for course: ${courseId}, subject: ${subjectId}, chapter: ${chapterId}`);
    return this.http.get(`${this.apiUrl}/${courseId}/subjects/${subjectId}/chapters/${chapterId}/topics`);
  }
}
