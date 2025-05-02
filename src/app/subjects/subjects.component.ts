import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../services/course.service';
import { SubjectService } from '../services/subject.service';
import { faHome, faBook, faLayerGroup, faEye, faMagic, faInfoCircle, faChevronRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.css'],
  standalone: false
})
export class SubjectsComponent implements OnInit {
  // FontAwesome icons
  faHome = faHome;
  faBook = faBook;
  faLayerGroup = faLayerGroup;
  faEye = faEye;
  faMagic = faMagic;
  faInfoCircle = faInfoCircle;
  faChevronRight = faChevronRight;
  
  courseId: number;
  courseName: string = '';
  subjects: any[] = [];
  
  isGenerating: boolean = false;
  generatingSubjectId: number | null = null;
  errorMessage: string | null = null;
  isLoading: boolean = true;

  constructor(
    private courseService: CourseService,
    private subjectService: SubjectService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.courseId = +this.route.snapshot.paramMap.get('course_id')!;
  }

  ngOnInit() {
    // Load course details
    this.courseService.getCourseDetails(this.courseId).subscribe({
      next: (course) => {
        this.courseName = course.name;
      },
      error: (err) => console.error('Error loading course details:', err)
    });

    // Load subjects for this course
    this.loadSubjects();
  }

  loadSubjects() {
    this.isLoading = true;
    this.errorMessage = null;
    
    this.subjectService.getSubjects(this.courseId).subscribe({
      next: (subjects) => {
        this.subjects = subjects;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading subjects:', err);
        this.errorMessage = 'Failed to load subjects. Please try again.';
        this.isLoading = false;
      }
    });
  }
  
  generateSubjects() {
    this.isGenerating = true;
    this.errorMessage = null;
    
    this.subjectService.generateSubjects(this.courseId).subscribe({
      next: () => {
        this.isGenerating = false;
        this.loadSubjects(); // Refresh subjects after generation
      },
      error: (error) => {
        this.isGenerating = false;
        console.error('Error generating subjects:', error);
        if (error.status === 403) {
          this.errorMessage = 'You need to set your Google API key in your profile first.';
        } else {
          this.errorMessage = 'Failed to generate subjects. Please try again.';
        }
      }
    });
  }
  
  viewSubjectContent(subjectId: number) {
    // Navigate to the course content view for this subject
    this.router.navigate([`/courses/${this.courseId}/subjects/${subjectId}/content`]);
  }
  
  goBack() {
    this.router.navigate(['/courses']);
  }
}
