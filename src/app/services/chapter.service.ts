import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChapterService {
  private apiUrl = environment.courseApiUrl;
  
  constructor(private http: HttpClient) { }
  
  generateChapters(courseId: number, subjectId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${courseId}/subjects/${subjectId}/generate_chapters`, {});
  }
  
  getChapters(courseId: number, subjectId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${courseId}/subjects/${subjectId}/chapters`);
  }
  
  // Get chapter details by ID
  getChapterDetails(courseId: number, subjectId: number, chapterId: number): Observable<any> {
    console.log(`Fetching chapter details for course: ${courseId}, subject: ${subjectId}, chapter: ${chapterId}`);
    return this.http.get(`${this.apiUrl}/${courseId}/subjects/${subjectId}/chapters/${chapterId}`);
  }
}
