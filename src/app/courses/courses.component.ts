import { Component, OnInit } from '@angular/core';
import { CourseService } from '../services/course.service';
import { SubjectService } from '../services/subject.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { faHome, faBook, faPlus, faExclamationTriangle, faExclamationCircle, faMagic, faEye } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-courses',
    templateUrl: './courses.component.html',
    styleUrls: ['./courses.component.css'],
    standalone: false
})
export class CoursesComponent implements OnInit {
  // FontAwesome icons
  faHome = faHome;
  faBook = faBook;
  faPlus = faPlus;
  faExclamationTriangle = faExclamationTriangle;
  faExclamationCircle = faExclamationCircle;
  faMagic = faMagic;
  faEye = faEye;

  courses: any[] = [];
  userHasApiKey: boolean = false;
  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(
    private courseService: CourseService, 
    private subjectService: SubjectService,
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
    
    const course = this.courses.find(c => c.id === courseId);
    const actionVerb = course && course.has_subjects ? 'updating' : 'generating';
    
    // Show that we're generating content for this course
    course.isGenerating = true;
    
    this.subjectService.generateSubjects(courseId).subscribe({
      next: () => {
        if (course) {
          // Update the local course data to reflect that it now has subjects
          course.has_subjects = true;
          course.isGenerating = false;
        }
        
        // Navigate only if we're generating for the first time, otherwise stay on the page
        if (actionVerb === 'generating') {
          this.router.navigate([`/courses/${courseId}/subjects-chapters`]);
        }
      },
      error: (error) => {
        if (course) {
          course.isGenerating = false;
        }
        console.error(`Error ${actionVerb} subjects:`, error);
        if (error.status === 403) {
          this.errorMessage = 'You need to set your Google API key in your profile first.';
        } else {
          this.errorMessage = `Failed to ${actionVerb.replace('ing', '')} subjects. Please try again.`;
        }
      }
    });
  }
  
  viewSubjects(courseId: number) {
    this.router.navigate([`/courses/${courseId}/subjects`]);
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
