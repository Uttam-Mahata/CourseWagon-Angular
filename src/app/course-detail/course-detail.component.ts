import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css']
})
export class CourseDetailComponent implements OnInit {
  courseName: string = '';

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Retrieve the course name from the URL
    this.route.paramMap.subscribe(params => {
      this.courseName = params.get('courseName')!;
    });
  }
}
