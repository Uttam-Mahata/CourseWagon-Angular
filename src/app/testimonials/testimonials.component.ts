import { Component, OnInit } from '@angular/core';
import { faUser, faStar, faStarHalfAlt, faPen, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { TestimonialService } from '../services/testimonial.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-testimonials',
  standalone: false,
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.css']
})
export class TestimonialsComponent implements OnInit {
  // FontAwesome icons
  faUser = faUser;
  faStar = faStar;
  farStar = farStar;
  faStarHalfAlt = faStarHalfAlt;
  faPen = faPen;
  faCheck = faCheck;
  faTimes = faTimes;

  // Testimonial data
  testimonials: any[] = [];
  isLoading: boolean = true;
  error: string | null = null;
  
  // User-related state
  isAuthenticated: boolean = false;
  userTestimonial: any = null;
  
  // Form data
  showForm: boolean = false;
  newTestimonial = {
    quote: '',
    rating: 5
  };
  
  // Form states
  isSubmitting: boolean = false;
  formError: string | null = null;
  formSuccess: string | null = null;

  constructor(
    private testimonialService: TestimonialService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadTestimonials();
    this.checkAuthState();
  }

  checkAuthState(): void {
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isAuthenticated = isLoggedIn;
      if (isLoggedIn) {
        this.loadUserTestimonial();
      }
    });
  }

  loadTestimonials(): void {
    this.isLoading = true;
    this.testimonialService.getApprovedTestimonials().subscribe({
      next: (data) => {
        this.testimonials = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load testimonials';
        this.isLoading = false;
        console.error('Error loading testimonials', err);
      }
    });
  }

  loadUserTestimonial(): void {
    this.testimonialService.getUserTestimonial().subscribe({
      next: (data) => {
        this.userTestimonial = data;
      },
      error: (err) => {
        // It's fine if user doesn't have a testimonial
        if (err.status !== 404) {
          console.error('Error loading user testimonial', err);
        }
      }
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    this.formError = null;
    this.formSuccess = null;
  }

  submitTestimonial(): void {
    if (!this.newTestimonial.quote.trim()) {
      this.formError = 'Please enter your testimonial';
      return;
    }

    this.isSubmitting = true;
    this.formError = null;
    
    // Determine if creating new or updating existing
    if (this.userTestimonial) {
      this.updateTestimonial();
    } else {
      this.createTestimonial();
    }
  }

  createTestimonial(): void {
    this.testimonialService.createTestimonial(
      this.newTestimonial.quote,
      this.newTestimonial.rating
    ).subscribe({
      next: (response) => {
        this.userTestimonial = response;
        this.formSuccess = 'Your testimonial has been submitted for approval!';
        this.isSubmitting = false;
        setTimeout(() => this.showForm = false, 3000);
      },
      error: (err) => {
        this.formError = err.error.error || 'Failed to submit testimonial';
        this.isSubmitting = false;
        console.error('Error submitting testimonial', err);
      }
    });
  }

  updateTestimonial(): void {
    this.testimonialService.updateTestimonial(
      this.userTestimonial.id,
      this.newTestimonial.quote,
      this.newTestimonial.rating
    ).subscribe({
      next: (response) => {
        this.userTestimonial = response;
        this.formSuccess = 'Your testimonial has been updated and submitted for approval!';
        this.isSubmitting = false;
        setTimeout(() => this.showForm = false, 3000);
      },
      error: (err) => {
        this.formError = err.error.error || 'Failed to update testimonial';
        this.isSubmitting = false;
        console.error('Error updating testimonial', err);
      }
    });
  }

  deleteTestimonial(): void {
    if (!confirm('Are you sure you want to delete your testimonial?')) {
      return;
    }

    this.testimonialService.deleteTestimonial(this.userTestimonial.id).subscribe({
      next: () => {
        this.userTestimonial = null;
        this.formSuccess = 'Your testimonial has been deleted';
        setTimeout(() => this.formSuccess = null, 3000);
      },
      error: (err) => {
        this.formError = 'Failed to delete testimonial';
        console.error('Error deleting testimonial', err);
      }
    });
  }

  // Helper method to generate star rating elements
  generateRatingStars(rating: number): { icon: any, half: boolean }[] {
    const stars: { icon: any, half: boolean }[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push({ icon: this.faStar, half: false });
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push({ icon: this.faStarHalfAlt, half: true });
    }
    
    // Add empty stars to make 5 total
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push({ icon: this.farStar, half: false });
    }
    
    return stars;
  }

  editTestimonial(): void {
    this.newTestimonial.quote = this.userTestimonial.quote;
    this.newTestimonial.rating = this.userTestimonial.rating;
    this.showForm = true;
    this.formError = null;
    this.formSuccess = null;
  }
}
