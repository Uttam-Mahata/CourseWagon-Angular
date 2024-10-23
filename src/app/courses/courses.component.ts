import { Component, OnInit } from '@angular/core';
import { CourseService } from '../services/course.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html'
})
export class CoursesComponent implements OnInit {
  courses: any[] = [];

  constructor(private courseService: CourseService, private router: Router) {}

  ngOnInit() {
    this.courseService.getCourses().subscribe((courses: any[]) => {
      this.courses = courses;
    });
  }

  generateSubjects(courseId: number) {
    this.courseService.generateSubjects(courseId).subscribe(() => {
      this.router.navigate([`/courses/${courseId}/subjects`]);  // Navigate to subjects
    });
  }
  viewSubjects(courseId: number) {
    this.router.navigate([`/courses/${courseId}/subjects`]);  // Navigate to subjects
  }
}
