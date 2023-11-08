import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Interview } from '../models/interview.model';
import { InterviewService } from '../services/interview.service';

@Component({
  selector: 'app-edit-interview',
  templateUrl: './edit-interview.component.html',
  styleUrls: ['./edit-interview.component.css']
})
export class EditInterviewComponent implements OnChanges {
  private _interview: Interview | null = null;
  isEditable: boolean = false;
  @Output() close = new EventEmitter<void>();

  @Input() set interview(value: Interview | null) {
    this._interview = value;
    if (value) {
      this.patchFormValue();
    }
  }

  get interview(): Interview | null {
    return this._interview;
  }

  interviewForm: FormGroup = this.fb.group({
    interview_date: ['', Validators.required],
    interview_time: ['', Validators.required],
    position_name: ['', Validators.required],
    company_name: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private interviewService: InterviewService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['interview'] && changes['interview'].currentValue) {
      this._interview = changes['interview'].currentValue;
      this.patchFormValue();
    }
  }

  private patchFormValue(): void {
    if (this._interview) {
      this.interviewForm.patchValue(this._interview);
    }
  }

  toggleEdit(): void {
    this.isEditable = !this.isEditable;
  }

  updateInterview(): void {
    if (this.interviewForm.valid && this.interview && this.interview.id !== undefined) {
      const updatedInterview: Interview = {
        ...this.interview,
        ...this.interviewForm.value
      };
      this.interviewService.updateInterview(this.interview.id, updatedInterview).subscribe({
        next: () => this.close.emit(), // Change to emit close event
        error: (error) => console.error('Error updating interview', error)
      });
    } else {
      console.error('Form is invalid or interview data is null');
    }
  }

  cancelEdit(): void {
    this.close.emit();
  }
}
