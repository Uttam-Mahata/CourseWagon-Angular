import { Component } from '@angular/core';
import { faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-testimonials',
  standalone: false,
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.css']
})
export class TestimonialsComponent {
  // FontAwesome icons
  faUser = faUser;

  // Testimonial data
  testimonials = [
    {
      quote: "Course Wagon transformed my learning experience! The AI-generated content is incredibly helpful.",
      author: "Alex J."
    },
    {
      quote: "I love the interactive features and how easy it is to track my progress!",
      author: "Sarah L."
    },
    {
      quote: "The personalized learning paths have made a huge difference in my studies.",
      author: "John D."
    }
  ];
}
