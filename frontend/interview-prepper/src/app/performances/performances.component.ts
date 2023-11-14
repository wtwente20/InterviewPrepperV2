import { Component, OnInit } from '@angular/core';
import { InterviewService } from '../services/interview.service';
import { PerformanceService } from '../services/performance.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Interview } from '../models/interview.model';
import { Performance } from '../models/performance.model';


@Component({
  selector: 'app-performances',
  templateUrl: './performances.component.html',
  styleUrl: './performances.component.css'
})
export class PerformancesComponent implements OnInit {
  public pendingReviews: Interview[] = [];
  public completedReviews: Performance[] = [];
  activeInterviewId: number | null = null;
  activePerformanceId: number | null = null;
  performanceForm: FormGroup;

  constructor(
    private performanceService: PerformanceService,
    private interviewService: InterviewService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.performanceForm = this.fb.group({
      confidence_rating: ['', Validators.required],
      technical_rating: ['', Validators.required],
      behavioral_rating: ['', Validators.required],
      overall_feeling: [''],
      summary: [''],
      struggled_question_id: [''],
      well_answered_question_id: ['']
    });
  }

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
    this.activeInterviewId = interview.id;
    this.activePerformanceId = null;
    this.performanceForm.reset();
  }

  editReview(performance: Performance) {
    this.activePerformanceId = performance.id;
    this.activeInterviewId = null;
    this.performanceForm.patchValue(performance);
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

  submitReview() {
    if (this.performanceForm.valid && this.activeInterviewId !== null) {
      const performanceData = { ...this.performanceForm.value, interview_id: this.activeInterviewId };
      this.performanceService.createPerformance(performanceData).subscribe({
        next: (performance) => {
          this.completedReviews.push(performance);
          this.activeInterviewId = null; // Reset after submission
        },
        error: (error) => console.error('Error creating performance:', error)
      });
    }
  }

  cancelReview() {
    this.activeInterviewId = null;
    this.activePerformanceId = null;
    this.performanceForm.reset();
  }

  updateReview() {
    if (this.performanceForm.valid && this.activePerformanceId !== null) {
      this.performanceService.updatePerformance(this.activePerformanceId, this.performanceForm.value).subscribe({
        next: (updatedPerformance) => {
          const index = this.completedReviews.findIndex(p => p.id === updatedPerformance.id);
          if (index !== -1) {
            this.completedReviews[index] = updatedPerformance;
          }
          this.activePerformanceId = null; // Reset after updating
        },
        error: (error) => console.error('Error updating performance:', error)
      });
    }
  }
}
