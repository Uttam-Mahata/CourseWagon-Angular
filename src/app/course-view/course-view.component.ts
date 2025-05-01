import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../services/course.service';
import { SubjectService } from '../services/subject.service';
import { ChapterService } from '../services/chapter.service';
import { TopicService } from '../services/topic.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-course-view',
  standalone: false,
  templateUrl: './course-view.component.html',
  styleUrls: ['./course-view.component.css']
})
export class CourseViewComponent implements OnInit, OnDestroy {
  courseId: number;
  subjectId: number;
  courseName: string = '';
  subjectName: string = '';
  
  chapters: any[] = [];
  topics: { [chapterId: number]: any[] } = {};
  
  selectedChapterId: number | null = null;
  selectedTopicId: number | null = null;
  
  expandedChapters: { [chapterId: number]: boolean } = {};
  isLoading: boolean = false;
  isMobileSidebarOpen: boolean = false;
  
  private routeSubscription: Subscription;

  constructor(
    private courseService: CourseService,
    private subjectService: SubjectService,
    private chapterService: ChapterService,
    private topicService: TopicService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.courseId = +this.route.snapshot.paramMap.get('course_id')!;
    this.subjectId = +this.route.snapshot.paramMap.get('subject_id')!;
    this.routeSubscription = new Subscription();
  }

  ngOnInit() {
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      this.courseId = +params.get('course_id')!;
      this.subjectId = +params.get('subject_id')!;
      const chapterId = params.get('chapter_id');
      const topicId = params.get('topic_id');
      
      if (chapterId) this.selectedChapterId = +chapterId;
      if (topicId) this.selectedTopicId = +topicId;
      
      this.loadCourseAndSubject();
      this.loadChapters();
    });
  }
  
  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
  
  loadCourseAndSubject() {
    this.courseService.getCourseDetails(this.courseId).subscribe({
      next: (course: any) => {
        this.courseName = course.name;
      },
      error: (err) => console.error('Error loading course details:', err)
    });
    
    this.subjectService.getSubjectDetails(this.courseId, this.subjectId).subscribe({
      next: (subject: any) => {
        this.subjectName = subject.name;
      },
      error: (err) => console.error('Error loading subject details:', err)
    });
  }
  
  loadChapters() {
    this.isLoading = true;
    this.chapterService.getChapters(this.courseId, this.subjectId).subscribe({
      next: (chapters: any[]) => {
        this.chapters = chapters;
        
        // Auto-expand the selected chapter
        if (this.selectedChapterId) {
          this.expandedChapters[this.selectedChapterId] = true;
          this.loadTopicsForChapter(this.selectedChapterId);
        }
        
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading chapters:', err);
        this.isLoading = false;
      }
    });
  }
  
  toggleChapter(chapterId: number) {
    // Toggle chapter expansion
    this.expandedChapters[chapterId] = !this.expandedChapters[chapterId];
    
    // Load topics if expanded and not already loaded
    if (this.expandedChapters[chapterId] && (!this.topics[chapterId] || this.topics[chapterId].length === 0)) {
      this.loadTopicsForChapter(chapterId);
    }
  }
  
  loadTopicsForChapter(chapterId: number) {
    if (!this.topics[chapterId]) {
      this.topicService.getTopics(this.courseId, this.subjectId, chapterId).subscribe({
        next: (topics: any[]) => {
          this.topics[chapterId] = topics;
        },
        error: (err) => console.error('Error loading topics:', err)
      });
    }
  }
  
  selectTopic(chapterId: number, topicId: number) {
    this.selectedChapterId = chapterId;
    this.selectedTopicId = topicId;
    
    // Navigate to the content page
    this.router.navigate([
      `/courses/${this.courseId}/subjects/${this.subjectId}/chapters/${chapterId}/topics/${topicId}`
    ]);
    
    // Close mobile sidebar after selection
    this.isMobileSidebarOpen = false;
  }
  
  toggleMobileSidebar() {
    this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
  }
  
  backToSubjects() {
    this.router.navigate([`/courses/${this.courseId}/subjects`]);
  }
}
