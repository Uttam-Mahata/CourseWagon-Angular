import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../services/course.service';
import { SubjectService } from '../services/subject.service';
import { faHome, faBook, faLayerGroup, faEye, faMagic, faInfoCircle, faChevronRight, faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';

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
  faEdit = faEdit;
  faTrash = faTrash;
  faPlus = faPlus;
  
  courseId: number;
  courseName: string = '';
  subjects: any[] = [];
  
  isGenerating: boolean = false;
  generatingSubjectId: number | null = null;
  errorMessage: string | null = null;
  isLoading: boolean = true;
  
  // CRUD operations state
  showEditSubjectModal: boolean = false;
  showDeleteSubjectModal: boolean = false;
  showCreateSubjectModal: boolean = false;
  editingSubject: any = null;
  isDeletingSubject: boolean = false;
  newSubjectName: string = '';

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
  
  // CRUD Operations for Subjects
  
  // Create new subject methods
  openCreateSubjectModal() {
    this.newSubjectName = '';
    this.showCreateSubjectModal = true;
  }
  
  closeCreateSubjectModal() {
    this.showCreateSubjectModal = false;
    this.newSubjectName = '';
  }
  
  submitNewSubject() {
    if (!this.newSubjectName || !this.newSubjectName.trim()) {
      this.errorMessage = 'Subject name is required';
      return;
    }
    
    this.subjectService.createSubject(this.courseId, this.newSubjectName).subscribe({
      next: (newSubject) => {
        this.subjects.push(newSubject);
        this.closeCreateSubjectModal();
      },
      error: (err) => {
        console.error('Error creating subject:', err);
        this.errorMessage = 'Failed to create subject. Please try again.';
      }
    });
  }
  
  // Create new subject - old method to be replaced
  createNewSubject() {
    this.openCreateSubjectModal();
  }
  
  // Edit subject
  openEditSubjectModal(subject: any) {
    this.editingSubject = { ...subject };
    this.showEditSubjectModal = true;
  }

  closeEditSubjectModal() {
    this.showEditSubjectModal = false;
    this.editingSubject = null;
  }

  updateSubject() {
    if (!this.editingSubject || !this.editingSubject.name.trim()) {
      this.errorMessage = 'Subject name is required';
      return;
    }

    this.subjectService.updateSubject(
      this.courseId,
      this.editingSubject.id,
      this.editingSubject.name
    ).subscribe({
      next: () => {
        // Update local subject data
        const index = this.subjects.findIndex(s => s.id === this.editingSubject.id);
        if (index !== -1) {
          this.subjects[index].name = this.editingSubject.name;
        }
        this.closeEditSubjectModal();
      },
      error: (err) => {
        console.error('Error updating subject:', err);
        this.errorMessage = 'Failed to update subject. Please try again.';
      }
    });
  }
  
  // Delete subject
  openDeleteSubjectModal(subject: any) {
    this.editingSubject = subject;
    this.showDeleteSubjectModal = true;
  }

  closeDeleteSubjectModal() {
    this.showDeleteSubjectModal = false;
    this.editingSubject = null;
  }

  deleteSubject() {
    if (!this.editingSubject) return;
    
    this.isDeletingSubject = true;
    
    this.subjectService.deleteSubject(
      this.courseId,
      this.editingSubject.id
    ).subscribe({
      next: () => {
        // Remove subject from local data
        this.subjects = this.subjects.filter(s => s.id !== this.editingSubject.id);
        this.closeDeleteSubjectModal();
        this.isDeletingSubject = false;
      },
      error: (err) => {
        console.error('Error deleting subject:', err);
        this.errorMessage = 'Failed to delete subject. Please try again.';
        this.isDeletingSubject = false;
      }
    });
  }
}
