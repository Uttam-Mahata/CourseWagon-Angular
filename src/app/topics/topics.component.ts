import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../services/course.service';

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.css']
})
export class TopicsComponent implements OnInit {
  topics: any[] = [];
  courseId: number;
  subjectId: number;
  chapterId: number;
    loading: boolean = true;
    error: string = '';


  constructor(
    private courseService: CourseService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.courseId = +this.route.snapshot.paramMap.get('course_id')!;
      this.subjectId = +this.route.snapshot.paramMap.get('subject_id')!;
      this.chapterId = +this.route.snapshot.paramMap.get('chapter_id')!;
  }

  ngOnInit() {
      this.loadTopics();
  }

    loadTopics() {
        this.loading = true;
      this.courseService.getTopics(this.courseId, this.subjectId, this.chapterId).subscribe({
          next: (topics: any[]) => {
                this.topics = topics;
                this.loading = false;
                this.error = '';
            },
           error: (error) => {
                console.error('Error fetching topics:', error);
                this.error = 'Failed to load topics. Please try again later.';
                this.loading = false;
           }
      });
    }


  viewContent(topicId: number) {
        this.router.navigate([`/courses/${this.courseId}/subjects/${this.subjectId}/chapters/${this.chapterId}/topics/${topicId}/content`]);
    }

    generateContent(topicId: number) {
        this.loading = true;
         this.courseService.generateContent(this.courseId, this.subjectId, this.chapterId, topicId).subscribe({
             next: () => {
                 this.router.navigate([`/courses/${this.courseId}/subjects/${this.subjectId}/chapters/${this.chapterId}/topics/${topicId}/content`]);
                this.loading = false;
                 this.error = '';
            },
              error: (error) => {
                console.error('Error generating content:', error);
                this.error = 'Failed to generate content. Please try again.';
                   this.loading = false;
              }
         });
    }
}