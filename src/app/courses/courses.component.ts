import { Component, OnInit } from '@angular/core';
import { CourseService } from '../services/course.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-courses',
    templateUrl: './courses.component.html',
    styleUrls: ['./courses.component.css'],
    standalone: false
})
export class CoursesComponent implements OnInit {
  courses: any[] = [];
  userHasApiKey: boolean = false;
  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(
    private courseService: CourseService, 
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Check if user has API key
    this.authService.currentUser$.subscribe(user => {
      this.userHasApiKey = user?.has_api_key || false;
      
      if (this.userHasApiKey) {
        this.loadCourses();
      } else {
        this.isLoading = false;
      }
    });
  }

  loadCourses() {
    this.isLoading = true;
    this.errorMessage = null;
    
    this.courseService.getMyCourses().subscribe({
      next: (courses: any[]) => {
        this.courses = courses;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching courses:', error);
        this.errorMessage = 'Failed to load courses. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  generateSubjects(courseId: number) {
    if (!this.userHasApiKey) {
      this.router.navigate(['/profile']);
      return;
    }
    
    this.courseService.generateSubjects(courseId).subscribe({
      next: () => {
        this.router.navigate([`/courses/${courseId}/subjects-modules`]);
      },
      error: (error) => {
        console.error('Error generating subjects:', error);
        if (error.status === 403) {
          this.errorMessage = 'You need to set your Google API key in your profile first.';
        } else {
          this.errorMessage = 'Failed to generate subjects. Please try again.';
        }
      }
    });
  }
  
  viewSubjects(courseId: number) {
    this.router.navigate([`/courses/${courseId}/subjects-modules`]);
  }
  
  navigateToCourseCreation() {
    if (!this.userHasApiKey) {
      this.router.navigate(['/profile']);
      return;
    }
    
    this.router.navigate(['/create-course']);
  }
  
  navigateToProfile() {
    this.router.navigate(['/profile']);
  }
}
