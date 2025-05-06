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
  userHasApiKey: boolean = false;

  constructor(
    private courseService: CourseService, 
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.userHasApiKey = !!user?.has_api_key;
      console.log('Course component - user has API key:', this.userHasApiKey);
    });
  }

  generateCourse() {
    if (!this.courseName.trim()) {
      this.errorMessage = 'Course name is required';
      return;
    }

    if (!this.userHasApiKey) {
      this.errorMessage = 'You need to set your Google API key in your profile first.';
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
        
        if (error.status === 403) {
          this.errorMessage = 'You need to set your Google API key in your profile first.';
        } else {
          this.errorMessage = error.error?.error || 'Failed to create course. Please try again.';
        }
      }
    });
  }

  navigateToProfile() {
    this.router.navigate(['/profile']);
  }
}
