import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../services/course.service';
import { 
  faHome, faBook, faLayerGroup, faList, faPlusCircle, 
  faEye, faMagic, faInfoCircle, faChevronRight 
} from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-chapters-topics',
    templateUrl: './chapters-topics.component.html',
    styleUrls: ['./chapters-topics.component.css'],
    standalone: false
})
export class ChaptersTopicsComponent implements OnInit {
  // FontAwesome icons
  faHome = faHome;
  faBook = faBook;
  faLayerGroup = faLayerGroup;
  faList = faList;
  faPlusCircle = faPlusCircle;
  faEye = faEye;
  faMagic = faMagic;
  faInfoCircle = faInfoCircle;
  faChevronRight = faChevronRight;
  
  chapters: any[] = [];
  topics: any[] = [];
  courseId: number;
  courseName: string = '';
  subjectId: number;
  moduleId: number;
  moduleName: string = '';
  selectedChapterId: number | null = null;
  selectedChapterName: string | null = null;
  isGeneratingTopics: boolean = false;
  generatingChapterId: number | null = null;
  isGeneratingSubtopics: boolean = false;
  generatingTopicId: number | null = null;

  constructor(
    private courseService: CourseService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Extract courseId, subjectId, and moduleId from route params
    this.courseId = +this.route.snapshot.paramMap.get('course_id')!;
    this.subjectId = +this.route.snapshot.paramMap.get('subject_id')!;
    this.moduleId = +this.route.snapshot.paramMap.get('module_id')!;
  }

  ngOnInit() {
    // Fetch chapters for the given module
    this.courseService.getChapters(this.courseId, this.subjectId, this.moduleId).subscribe((chapters: any[]) => {
      this.chapters = chapters;
    });
    this.courseService.getCourseDetails(this.courseId).subscribe((courses: any) => {
      this.courseName = courses.name;
    });

    this.courseService.getModuleDetails(this.courseId, this.subjectId, this.moduleId).subscribe((module: any) => {
      this.moduleName = module.name;
    });
  }

  viewTopics(chapterId: number) {
    this.selectedChapterId = chapterId;
    this.selectedChapterName = this.chapters.find(chapter => chapter.id === chapterId)?.name || null;
    // Fetch topics for the selected chapter
    this.courseService.getTopics(this.courseId, this.subjectId, this.moduleId, chapterId).subscribe((topics: any[]) => {
      this.topics = topics;
    });
  }

  generateTopics(chapterId: number) {
    // Show loading state
    this.isGeneratingTopics = true;
    this.generatingChapterId = chapterId;
    
    // Trigger topic generation for a chapter
    this.courseService.generateTopics(this.courseId, this.subjectId, this.moduleId, chapterId).subscribe({
      next: () => {
        this.viewTopics(chapterId);  // Reload topics after generation
        this.isGeneratingTopics = false;
        this.generatingChapterId = null;
      },
      error: (error) => {
        console.error('Error generating topics:', error);
        this.isGeneratingTopics = false;
        this.generatingChapterId = null;
      }
    });
  }

  generateSubtopics(topicId: number) {
    // Show loading state
    this.isGeneratingSubtopics = true;
    this.generatingTopicId = topicId;
    
    // Trigger subtopic generation for a topic
    this.courseService.generateSubtopics(this.courseId, this.subjectId, this.moduleId, this.selectedChapterId!, topicId).subscribe({
      next: () => {
        // Reset loading state
        this.isGeneratingSubtopics = false;
        this.generatingTopicId = null;
        
        // Reload topics after generation
        this.viewTopics(this.selectedChapterId!);
      },
      error: (error) => {
        console.error('Error generating subtopics:', error);
        this.isGeneratingSubtopics = false;
        this.generatingTopicId = null;
      }
    });
  }

  viewSubtopics(topicId: number) {
    // Navigate to subtopics page for the selected topic
    this.router.navigate([`/courses/${this.courseId}/subjects/${this.subjectId}/modules/${this.moduleId}/chapters/${this.selectedChapterId}/topics/${topicId}/subtopics-content`]);
  }
}
