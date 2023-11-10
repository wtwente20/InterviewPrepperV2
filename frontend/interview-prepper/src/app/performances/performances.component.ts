import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { InterviewService } from '../services/interview.service';
import { PerformanceService } from '../services/performance.service';

import { Router } from '@angular/router';
import { Interview } from '../models/interview.model';
import { Performance } from '../models/performance.model';


@Component({
  selector: 'app-performances',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './performances.component.html',
  styleUrl: './performances.component.css'
})
export class PerformancesComponent implements OnInit {
  public pendingReviews: Interview[] = [];
  public completedReviews: Performance[] = [];

  constructor(
    private performanceService: PerformanceService,
    private interviewService: InterviewService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadPendingReviews();
    this.loadCompletedReviews();
  }

  loadPendingReviews() {
    this.performanceService.getInterviewsWithoutPerformance().subscribe(
      (interviews: Interview[]) => {
        this.pendingReviews = interviews;
      },
      (error) => console.error('Error loading interviews without performances:', error)
    );
  }

  loadCompletedReviews() {
    this.performanceService.getAllPerformances().subscribe(
      (performances: Performance[]) => {
        this.completedReviews = performances;
      },
      (error) => {
        console.error('Error loading completed reviews:', error);
      }
    );
  }

  startReview(interview: Interview) {
    // Navigate to the performance review form, passing the interview ID
    this.router.navigate(['/performance-review', { interviewId: interview.id }]);
  }
  
  editReview(performance: Performance) {
    // Navigate to the edit page, passing the performance ID
    this.router.navigate(['/edit-performance', performance.id]);
  }
  
  deleteReview(performance: Performance) {
    if (confirm('Are you sure you want to delete this performance review?')) {
      this.performanceService.deletePerformance(performance.id).subscribe({
        next: () => {
          // Remove the performance from the completed reviews
          this.completedReviews = this.completedReviews.filter(p => p.id !== performance.id);
        },
        error: (error) => console.error('Error deleting performance:', error)
      });
    }
  }
  // Methods to handle user actions like creating, editing, and deleting performance reviews...
}
