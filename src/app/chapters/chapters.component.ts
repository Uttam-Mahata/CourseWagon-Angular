import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../services/course.service';

@Component({
  selector: 'app-chapters',
  templateUrl: './chapters.component.html',
  styleUrls: ['./chapters.component.css']
})
export class ChaptersComponent implements OnInit {
  chapters: any[] = [];
  courseId: number;
  subjectId: number;
  loading: boolean = true;
  error: string = '';

  constructor(
    private courseService: CourseService,
    private route: ActivatedRoute,
    private router: Router
  ) {
      this.courseId = +this.route.snapshot.paramMap.get('course_id')!;
      this.subjectId = +this.route.snapshot.paramMap.get('subject_id')!;
  }

  ngOnInit() {
      this.loadChapters();
  }

    loadChapters() {
        this.loading = true;
        this.courseService.getChapters(this.courseId, this.subjectId).subscribe({
             next: (chapters: any[]) => {
                this.chapters = chapters;
                this.loading = false;
                this.error = '';
            },
             error: (error) => {
                console.error('Error fetching chapters:', error);
                this.error = 'Failed to load chapters. Please try again later.';
                 this.loading = false;
            }
        });
    }

  generateTopics(chapterId: number) {
      this.loading = true;
       this.courseService.generateTopics(this.courseId, this.subjectId, chapterId).subscribe({
           next: () => {
                 this.router.navigate([`/courses/${this.courseId}/subjects/${this.subjectId}/chapters/${chapterId}/topics`]);
                this.loading = false;
                this.error = '';
           },
            error: (error) => {
                console.error('Error generating topics:', error);
                this.error = 'Failed to generate topics. Please try again.';
                 this.loading = false;
            }
       });
  }

  viewTopics(chapterId: number) {
      this.router.navigate([`/courses/${this.courseId}/subjects/${this.subjectId}/chapters/${chapterId}/topics`]);
  }
}