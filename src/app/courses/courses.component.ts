import { Component, OnInit } from '@angular/core';
import { CourseService } from '../services/course.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
    courses: any[] = [];
    loading: boolean = true; // To track loading state
    error: string = ''; // To store error messages

    constructor(private courseService: CourseService, private router: Router) { }

    ngOnInit() {
        this.loadCourses();
    }

    loadCourses() {
        this.loading = true;
        this.courseService.getCourses().subscribe({
            next: (courses: any[]) => {
                this.courses = courses;
                this.loading = false;
                this.error = '';
            },
            error: (error) => {
                console.error('Error fetching courses:', error);
                this.error = 'Failed to load courses. Please try again later.';
                this.loading = false;
            }
        });
    }

    generateSubjects(courseId: number) {
        this.loading = true;
        this.courseService.generateSubjects(courseId).subscribe({
            next: () => {
                this.router.navigate([`/courses/${courseId}/subjects`]);  // Navigate to subjects
                this.loading = false;
                this.error = '';
            },
             error: (error) => {
                console.error('Error generating subjects:', error);
                this.error = 'Failed to generate subjects. Please try again.';
                this.loading = false;
            }
        });
    }

    viewSubjects(courseId: number) {
        this.router.navigate([`/courses/${courseId}/subjects`]);  // Navigate to subjects
    }

    navigateToCourseCreation() {
        this.router.navigate(['/create-course']);
    }
}