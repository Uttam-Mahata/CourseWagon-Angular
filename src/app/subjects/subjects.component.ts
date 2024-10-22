import { Component, OnInit } from '@angular/core';
import { CourseService } from '../services/course.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrl: './subjects.component.css'
})
export class SubjectsComponent implements OnInit {
subjects: any[] = [];

constructor(private courseService: CourseService, private router:Router) {}

ngOnInit() {
  this.courseService.getSubjects(courseId:number).subscribe((subjects: any[]) => {
    this.subjects = subjects;
  });
} 
