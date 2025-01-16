import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../services/course.service';

@Component({
    selector: 'app-subjects',
    templateUrl: './subjects.component.html',
    styleUrls: ['./subjects.component.css']
})
export class SubjectsComponent implements OnInit {
    subjects: any[] = [];
    courseId: number;
    loading: boolean = true; // To track loading state
    error: string = ''; // To store error messages

    constructor(
        private courseService: CourseService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        // Extract courseId from route params
        this.courseId = +this.route.snapshot.paramMap.get('course_id')!;
    }

    ngOnInit() {
        this.loadSubjects();
    }

    loadSubjects() {
        this.loading = true;
        this.courseService.getSubjects(this.courseId).subscribe({
            next: (subjects: any[]) => {
                this.subjects = subjects;
                this.loading = false;
                this.error = '';
            },
            error: (error) => {
                console.error('Error fetching subjects:', error);
                this.error = 'Failed to load subjects. Please try again later.';
                this.loading = false;
            }
        });
    }

    generateChapters(subjectId: number) {
          this.loading = true;
         this.courseService.generateChapters(this.courseId, subjectId).subscribe({
            next: () => {
                  this.router.navigate([`/courses/${this.courseId}/subjects/${subjectId}/chapters`]);
                 this.loading = false;
                 this.error = '';
            },
             error: (error) => {
                console.error('Error generating chapters:', error);
                this.error = 'Failed to generate chapters. Please try again.';
                this.loading = false;
            }
        });
    }

    viewChapters(subjectId: number) {
        // Navigate to chapters page for the selected subject
        this.router.navigate([`/courses/${this.courseId}/subjects/${subjectId}/chapters`]);
    }
}