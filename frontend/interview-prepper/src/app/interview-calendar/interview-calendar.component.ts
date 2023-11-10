import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
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
  @Output() refreshCalendarEvent = new EventEmitter();

  constructor(private interviewService: InterviewService) { }

  ngOnInit(): void {
    this.loadInterviews();
  }

  loadInterviews() {
    this.interviewService.getAllInterviews().subscribe({
      next: (interviews: Interview[]) => {
        this.events = interviews.map((interview: Interview) => {
          const interviewDateTime = new Date(interview.interview_date + 'T' + interview.interview_time);
  
          //calculate the end time as five minutes after the start time
          const endDateTime = new Date(interviewDateTime);
          endDateTime.setMinutes(endDateTime.getMinutes() + 5);
  
          //format the start time
          const formattedStartTime = interviewDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
          //remove leading zero from hours if it exists
          const timeParts = formattedStartTime.split(':');
          const hours = timeParts[0].replace(/^0/, '');
          const modifiedFormattedTime = `${hours}:${timeParts[1]}`;
  
          return {
            start: interviewDateTime,
            end: endDateTime,
            title: `${interview.position_name} at ${interview.company_name}, ${modifiedFormattedTime}`,
            allDay: false,
            meta: {
              interviewId: interview.id,
              interview: interview,
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

  deleteInterview(event: any): void {
    const eventId = event as number;
    if (confirm('Are you sure you want to delete this interview?')) {
      this.interviewService.deleteInterview(eventId).subscribe({
        next: () => this.loadInterviews(),
        error: (error) => console.error('Error during interview deletion', error)
      });
    }
  }

  refreshCalendar(): void {
    this.loadInterviews();
  }

  closeCreateInterviewSidebar(): void {
    this.showCreateInterviewSidebar = false;
  }

  closeEditInterviewSidebar(): void {
    this.showEditInterviewSidebar = false;
    this.selectedEvent = null;
  }
}
