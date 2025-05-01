import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../services/course.service';
import { TopicService } from '../services/topic.service';
import { ChapterService } from '../services/chapter.service';
import { ContentService } from '../services/content.service';
import { Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-topic-content',
  standalone: false,
  templateUrl: './topic-content.component.html',
  styleUrls: ['./topic-content.component.css']
})
export class TopicContentComponent implements OnInit, OnDestroy {
  courseId: number;
  subjectId: number;
  chapterId: number;
  topicId: number;
  
  topicName: string = '';
  chapterName: string = '';
  content: string | null = null;
  
  isLoading: boolean = true;
  isGenerating: boolean = false;
  errorMessage: string = '';
  
  private routeSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private chapterService: ChapterService,
    private topicService: TopicService,
    private contentService: ContentService,
    private sanitizer: DomSanitizer
  ) {
    this.courseId = +this.route.snapshot.paramMap.get('course_id')!;
    this.subjectId = +this.route.snapshot.paramMap.get('subject_id')!;
    this.chapterId = +this.route.snapshot.paramMap.get('chapter_id')!;
    this.topicId = +this.route.snapshot.paramMap.get('topic_id')!;
    this.routeSubscription = new Subscription();
  }

  ngOnInit() {
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      this.isLoading = true;
      
      this.courseId = +params.get('course_id')!;
      this.subjectId = +params.get('subject_id')!;
      this.chapterId = +params.get('chapter_id')!;
      this.topicId = +params.get('topic_id')!;
      
      this.loadData();
    });
  }
  
  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
  
  loadData() {
    // Load chapter info
    this.chapterService.getChapterDetails(this.courseId, this.subjectId, this.chapterId).subscribe({
      next: (chapter) => {
        this.chapterName = chapter.name;
      },
      error: (err) => console.error('Error loading chapter:', err)
    });
    
    // Load topic info
    this.topicService.getTopicDetails(this.courseId, this.subjectId, this.chapterId, this.topicId).subscribe({
      next: (topic) => {
        this.topicName = topic.name;
        this.loadContent();
      },
      error: (err) => {
        console.error('Error loading topic:', err);
        this.isLoading = false;
      }
    });
  }
  
  loadContent() {
    this.contentService.getContent(this.courseId, this.subjectId, this.chapterId, this.topicId).subscribe({
      next: (content) => {
        this.content = this.prepareMarkdownContent(content);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading content:', err);
        this.content = null;
        this.isLoading = false;
      }
    });
  }
  
  generateContent() {
    this.isGenerating = true;
    this.errorMessage = '';
    
    this.contentService.generateContent(this.courseId, this.subjectId, this.chapterId, this.topicId).subscribe({
      next: () => {
        this.loadContent();
        this.isGenerating = false;
      },
      error: (err) => {
        console.error('Error generating content:', err);
        this.errorMessage = 'Failed to generate content. Please try again.';
        this.isGenerating = false;
      }
    });
  }
  
  // Helper method to fix common markdown rendering issues
  prepareMarkdownContent(content: string): string {
    if (!content) return '';
    
    // Fix line breaks and spacing issues
    let formatted = content
      .replace(/```/g, '\n```\n')       // Ensure code blocks have proper spacing
      .replace(/<pre class="mermaid">/g, '\n<pre class="mermaid">\n')  // Fix mermaid diagram spacing
      .replace(/<\/pre>/g, '\n</pre>\n')  // Fix closing pre tag spacing
      .replace(/\$\$/g, '\n$$\n')       // Fix math expressions spacing
      .replace(/\$\n\$/g, '$$ $$')       // Fix inline math expressions
      .replace(/\n{3,}/g, '\n\n');       // Remove excessive line breaks
    
    // Make sure each heading has a proper space after the # symbol
    formatted = formatted.replace(/^(#{1,6})([^ ])/gm, '$1 $2');
    
    return formatted;
  }
}
