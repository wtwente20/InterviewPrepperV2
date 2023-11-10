import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Interview } from '../models/interview.model';
import { InterviewService } from '../services/interview.service';
@Component({
  selector: 'app-edit-interview',
  templateUrl: './edit-interview.component.html',
  styleUrls: ['./edit-interview.component.css']
})
export class EditInterviewComponent implements OnInit {
  @Input() interviewId!: number;
  @Output() closeSidebar = new EventEmitter<void>();
  @Output() refreshCalendarRequest = new EventEmitter<void>();
  interviewForm: FormGroup;
  @Input() interview!: Interview | null;

  constructor(
    private fb: FormBuilder,
    private interviewService: InterviewService
  ) {
    this.interviewForm = this.fb.group({
      interview_date: ['', Validators.required],
      interview_time: ['', Validators.required],
      position_name: ['', Validators.required],
      company_name: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Load interview details when component initializes
    this.loadInterviewDetails();
  }

  loadInterviewDetails(): void {
    this.interviewService.getInterviewById(this.interviewId).subscribe({
      next: (interview: Interview) => {
        this.interview = interview;
        this.populateFormWithInterviewData();
      },
      error: (error) => {
        console.error('Error loading interview details', error);
      }
    });
  }

  populateFormWithInterviewData(): void {
    if (this.interview) {
      this.interviewForm.patchValue({
        interview_date: this.interview.interview_date,
        interview_time: this.interview.interview_time,
        position_name: this.interview.position_name,
        company_name: this.interview.company_name,
      });
    }
  }

  updateInterview(): void {
    if (this.interviewForm.valid && this.interview) {
      const updatedInterviewData: Interview = this.interviewForm.value;
      this.interviewService.updateInterview(this.interviewId, updatedInterviewData).subscribe({
        next: (updatedInterview: Interview) => {
          this.closeSidebar.emit();
          this.refreshCalendarRequest.emit(); // Refresh the calendar after updating an interview
        },
        error: (error) => {
          console.error('Error updating interview', error);
        }
      });
    }
  }

  deleteInterview(): void {
    if (this.interview && this.interview.id) {
      if (confirm('Are you sure you want to delete this interview?')) {
        this.interviewService.deleteInterview(this.interview.id).subscribe({
          next: () => {
            // Handle successful deletion, e.g., show a success message
            this.closeSidebar.emit();
            this.refreshCalendarRequest.emit();
          },
          error: (error) => {
            console.error('Error during interview deletion', error);
            // Handle errors, e.g., display an error message to the user
          }
        });
      }
    }
  }

  cancelEdit(): void {
    this.closeSidebar.emit();
  }
}