import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../services/course.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {
  content: any;
  courseId: number;
  subjectId: number;
  chapterId: number;
  topicId: number;
    loading: boolean = true;
    error: string = '';


  constructor(
    private courseService: CourseService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {
      this.courseId = +this.route.snapshot.paramMap.get('course_id')!;
      this.subjectId = +this.route.snapshot.paramMap.get('subject_id')!;
      this.chapterId = +this.route.snapshot.paramMap.get('chapter_id')!;
      this.topicId = +this.route.snapshot.paramMap.get('topic_id')!;
  }

    ngOnInit() {
      this.loadContent();
    }

    loadContent() {
        this.loading = true;
        this.courseService.getContent(this.courseId, this.subjectId, this.chapterId, this.topicId).subscribe({
             next: (content: any) => {
                this.content = content;
                this.loading = false;
                this.error = '';
            },
              error: (error) => {
                console.error('Error fetching content:', error);
                this.error = 'Failed to load content. Please try again later.';
                this.loading = false;
            }
        });
    }
      goBack(): void {
        this.location.back();
      }
}