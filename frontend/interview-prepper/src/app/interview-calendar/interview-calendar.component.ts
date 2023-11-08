import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { Interview } from '../models/interview.model';
import { InterviewService } from '../services/interview.service';

@Component({
  selector: 'app-interview-calendar',
  templateUrl: './interview-calendar.component.html',
  styleUrls: ['./interview-calendar.component.css']
})
export class InterviewCalendarComponent implements OnInit {
  @ViewChild('customEventTitleTemplate') customEventTitleTemplate!: TemplateRef<any>;
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  showCreateInterviewSidebar: boolean = false;
  showEditInterviewSidebar: boolean = false;
  selectedEvent: Interview | null = null;

  constructor(private interviewService: InterviewService) { }

  ngOnInit(): void {
    this.loadInterviews();
  }

  loadInterviews() {
    this.interviewService.getAllInterviews().subscribe({
      next: (interviews: Interview[]) => {
        this.events = interviews.map((interview: Interview) => {
          const interviewDateTime = new Date(interview.interview_date + 'T' + interview.interview_time);
          return {
            start: interviewDateTime,
            title: `${interview.position_name} at ${interview.company_name}`,
            allDay: false,
            meta: {
              interviewId: interview.id
            }
          };
        });
      },
      error: (error) => {
        console.error('There was an error loading the interviews', error);
      }
    });
  }

  openEditSidebar(eventData: { event: CalendarEvent }): void {
    this.selectedEvent = eventData.event.meta.interview;
    this.showEditInterviewSidebar = true;
  }

  deleteInterview(eventId: number): void {
    if (confirm('Are you sure you want to delete this interview?')) {
      this.interviewService.deleteInterview(eventId).subscribe({
        next: () => this.loadInterviews(),
        error: (error) => console.error('Error during interview deletion', error)
      });
    }
  }

  closeCreateInterviewSidebar(): void {
    this.showCreateInterviewSidebar = false;
  }

  closeEditInterviewSidebar(): void {
    this.showEditInterviewSidebar = false;
    this.selectedEvent = null;
  }
}
