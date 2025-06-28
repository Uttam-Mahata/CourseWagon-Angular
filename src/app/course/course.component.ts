import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CourseService } from '../services/course.service';
import { AuthService } from '../services/auth/auth.service';
import { 
  faExclamationTriangle, faExclamationCircle, faBook, faMagic, 
  faChalkboardTeacher, faBrain, faTasks, faMobileAlt, faClock, faKey
} from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.css'],
    standalone: false
})
export class CourseComponent implements OnInit {
  // FontAwesome icons
  faExclamationTriangle = faExclamationTriangle;
  faExclamationCircle = faExclamationCircle;
  faBook = faBook;
  faMagic = faMagic;
  faChalkboardTeacher = faChalkboardTeacher;
  faBrain = faBrain;
  faTasks = faTasks;
  faMobileAlt = faMobileAlt;
  faClock = faClock;
  faKey = faKey;

  courseName: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private courseService: CourseService, 
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // No longer need to check for API key since it's managed globally
  }

  generateCourse() {
    if (!this.courseName.trim()) {
      this.errorMessage = 'Course name is required';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.courseService.addCourse(this.courseName).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/courses']);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error creating course:', error);
        this.errorMessage = error.error?.error || 'Failed to create course. Please try again.';
      }
    });
  }

  navigateToProfile() {
    this.router.navigate(['/profile']);
  }
}
