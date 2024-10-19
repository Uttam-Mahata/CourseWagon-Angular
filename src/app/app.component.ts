// src/app/app.component.ts

import { Component, OnInit } from '@angular/core';
import { CourseService } from './course.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  courseName: string = '';  // Input field for course name
  message: string = '';     // Success or error message
  courses: any[] = [];      // List of courses

  constructor(private courseService: CourseService) { }

  ngOnInit(): void {
    this.getCourses();  // Fetch existing courses when the component loads
  }

  // Function to add a course by sending the course name to the backend
  addCourse(): void {
    if (!this.courseName) {
      this.message = 'Course name is required!';
      return;
    }

    const course = { name: this.courseName };
    this.courseService.addCourse(course).subscribe(
      (response) => {
        this.message = `Course created successfully: ${response.description}`;
        this.getCourses();  // Refresh the course list after adding
        this.courseName = '';  // Clear the input field
      },
      (error) => {
        this.message = `Error: ${error.error}`;
      }
    );
  }

  // Function to get all courses from the backend
  getCourses(): void {
    this.courseService.getCourses().subscribe(
      (data) => {
        this.courses = data;  // Update the courses list
      },
      (error) => {
        this.message = `Error fetching courses: ${error.error}`;
      }
    );
  }
}
