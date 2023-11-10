import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Interview } from '../models/interview.model';
import { InterviewService } from '../services/interview.service';

@Component({
  selector: 'app-create-interview',
  templateUrl: './create-interview.component.html',
  styleUrls: ['./create-interview.component.css']
})
export class CreateInterviewComponent {
  @Output() closeSidebar = new EventEmitter<void>();
  @Output() refreshCalendarRequest = new EventEmitter<void>();
  interviewForm: FormGroup = this.fb.group({
    interview_date: ['', Validators.required],
    interview_time: ['', Validators.required],
    position_name: ['', Validators.required],
    company_name: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private interviewService: InterviewService
  ) {}

  createInterview(): void {
    if (this.interviewForm.valid) {
      const interviewData: Interview = this.interviewForm.value;
      this.interviewService.createInterview(interviewData).subscribe({
        next: (interview) => {
          this.closeSidebar.emit();
          this.refreshCalendarRequest.emit();
        },
        error: (error) => console.error('Error creating interview', error)
      });
    }
  }

  cancelCreate(): void {
    this.closeSidebar.emit(); // Close the sidebar without creating
  }
}

