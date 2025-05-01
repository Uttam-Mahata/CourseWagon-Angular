import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../services/course.service';
import { 
  faHome, faBook, faLayerGroup, faEye, faMagic, 
  faBookOpen, faInfoCircle, faChevronRight 
} from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-subjects-modules',
    templateUrl: './subjects-modules.component.html',
    styleUrls: ['./subjects-modules.component.css'],
    standalone: false
})
export class SubjectsModulesComponent implements OnInit {
  // FontAwesome icons
  faHome = faHome;
  faBook = faBook;
  faLayerGroup = faLayerGroup;
  faEye = faEye;
  faMagic = faMagic;
  faBookOpen = faBookOpen;
  faInfoCircle = faInfoCircle;
  faChevronRight = faChevronRight;
  
  subjects: any[] = [];
  modules: any[] = [];
  courseId: number;
  courseName: string = '';
  selectedSubjectId: number | null = null;
  selectedSubjectName: string = '';
  isGenerating: boolean = false;
  generatingSubjectId: number | null = null;
  generatingModuleId: number | null = null;

  constructor(
    private courseService: CourseService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.courseId = +this.route.snapshot.paramMap.get('course_id')!;
  }

  ngOnInit() {
    // Fetch course details to get course name
    this.courseService.getCourseDetails(this.courseId).subscribe((courses: any) => {
      this.courseName = courses.name;
    });

    // Fetch subjects for the given course
    this.courseService.getSubjects(this.courseId).subscribe((subjects: any[]) => {
      this.subjects = subjects;
    });
  }

  viewModules(subjectId: number) {
    // Set the selected subject ID and name
    this.selectedSubjectId = subjectId;
    const selectedSubject = this.subjects.find(subject => subject.id === subjectId);
    this.selectedSubjectName = selectedSubject ? selectedSubject.name : '';

    // Fetch modules for the selected subject
    this.courseService.getModules(this.courseId, subjectId).subscribe((modules: any[]) => {
      this.modules = modules;
    });

    const modulesSection = document.getElementById("modulesSection");
    if (modulesSection) {
      modulesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  generateModules(subjectId: number) {
    // Show loading state
    this.generatingSubjectId = subjectId;
    this.isGenerating = true;
    
    // Trigger module generation for the subject and refresh modules
    this.courseService.generateModules(this.courseId, subjectId).subscribe({
      next: () => {
        this.viewModules(subjectId); // Refresh the module list after generating
        this.isGenerating = false;
        this.generatingSubjectId = null;
      },
      error: (error) => {
        console.error('Error generating modules:', error);
        this.isGenerating = false;
        this.generatingSubjectId = null;
      }
    });
  }

  viewChapters(moduleId: number) {
    this.router.navigate([`/courses/${this.courseId}/subjects/${this.selectedSubjectId}/modules/${moduleId}/chapters-topics`]);
  }

  generateChapters(moduleId: number) {
    // Show loading state
    this.generatingModuleId = moduleId;
    this.isGenerating = true;
    
    this.courseService.generateChapters(this.courseId, this.selectedSubjectId!, moduleId).subscribe({
      next: () => {
        // Success message with Tailwind toast notification
        this.isGenerating = false;
        this.generatingModuleId = null;
      },
      error: (error) => {
        console.error('Error generating chapters:', error);
        this.isGenerating = false;
        this.generatingModuleId = null;
      }
    });
  }
}
