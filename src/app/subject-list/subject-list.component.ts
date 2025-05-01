import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../services/course.service';
import { SubjectService } from '../services/subject.service';
import { faHome, faBook, faLayerGroup, faSpinner, faMagic, faEye } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-subject-list',
  standalone: false,
  templateUrl: './subject-list.component.html',
})
export class SubjectListComponent implements OnInit {
  faHome = faHome;
  faBook = faBook;
  faLayerGroup = faLayerGroup;
  faSpinner = faSpinner;
  faMagic = faMagic;
  faEye = faEye;
  
  courseId: number;
  courseName: string = '';
  subjects: any[] = [];
  
  isLoading: boolean = true;
  isGenerating: boolean = false;
  generatingSubjectId: number | null = null;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private subjectService: SubjectService
  ) {
    this.courseId = +this.route.snapshot.paramMap.get('course_id')!;
  }

  ngOnInit() {
    this.loadCourseDetails();
    this.loadSubjects();
  }
  
  loadCourseDetails() {
    this.courseService.getCourseDetails(this.courseId).subscribe({
      next: (course) => {
        this.courseName = course.name;
      },
      error: (err) => console.error('Error loading course details:', err)
    });
  }
  
  loadSubjects() {
    this.isLoading = true;
    
    this.subjectService.getSubjects(this.courseId).subscribe({
      next: (subjects) => {
        this.subjects = subjects;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading subjects:', err);
        this.isLoading = false;
        this.errorMessage = 'Failed to load subjects. Please try again.';
      }
    });
  }
  
  generateSubjects() {
    this.isGenerating = true;
    this.errorMessage = '';
    
    this.subjectService.generateSubjects(this.courseId).subscribe({
      next: () => {
        this.loadSubjects();
        this.isGenerating = false;
      },
      error: (err) => {
        console.error('Error generating subjects:', err);
        this.errorMessage = 'Failed to generate subjects. Please try again.';
        this.isGenerating = false;
      }
    });
  }
  
  viewSubject(subjectId: number) {
    this.router.navigate([`/courses/${this.courseId}/subjects/${subjectId}`]);
  }
  
  backToCourses() {
    this.router.navigate(['/courses']);
  }
}
