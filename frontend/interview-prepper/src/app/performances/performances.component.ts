import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PerformanceService } from '../services/performance.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Interview } from '../models/interview.model';
import { Performance } from '../models/performance.model';
import { Answer, Question } from '../models/question.model';
import { AnswerService } from '../services/answer.service';
import { AuthService } from '../services/auth.service';
import { QuestionService } from '../services/question.service';


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
  questions: Question[] = [];
  loadingQuestions = true;
  answers: Answer[] = [];
  loadingAnswers = true;
  struggledAnswerId: number | null = null;
  wellAnsweredAnswerId: number | null = null;

  constructor(
    private performanceService: PerformanceService,
    private questionService: QuestionService,
    private answerService: AnswerService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.performanceForm = this.fb.group({
      confidence_rating: ['', Validators.required],
      technical_rating: ['', Validators.required],
      behavioral_rating: ['', Validators.required],
      overall_feeling: [''],
      summary: [''],
      struggled_question: [{ value: '', disabled: true }, Validators.required],
      struggled_answer: [{ value: '', disabled: true }, Validators.required],
      well_answered_question: [{ value: '', disabled: true }, Validators.required],
      well_answered_answer: [{ value: '', disabled: true }, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadPendingReviews();
    this.loadCompletedReviews();
    this.loadQuestions();
    this.loadAnswers();
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

  loadQuestions() {
    this.loadingQuestions = true;
    this.performanceForm.get('struggled_question')?.disable();
    this.performanceForm.get('well_answered_question')?.disable();

    this.questionService.getAllQuestionsIncludingDefaults().subscribe(
      (questions: Question[]) => {
        this.questions = questions;
        this.loadingQuestions = false;
        this.performanceForm.get('struggled_question')?.enable();
        this.performanceForm.get('well_answered_question')?.enable();
      },
      (error) => {
        console.error('Error loading questions:', error);
        this.loadingQuestions = false;
      }
    );
  }

  loadAnswers() {
    this.loadingAnswers = true;
    this.performanceForm.get('struggled_answer')?.enable();
    this.performanceForm.get('well_answered_answer')?.enable();
    const userId = this.authService.getCurrentUserId();
    if (userId !== null) {
      this.answerService.getAnswersByUserId(userId).subscribe(
        (answers: Answer[]) => {
          this.answers = answers;
          this.loadingAnswers = false;
        },
        (error) => {
          console.error('Error loading answers:', error);
          this.loadingAnswers = false;
        }
      );
    }
  }

  startReview(interview: Interview) {
    this.activeInterviewId = interview.id;
    this.activePerformanceId = null;
    this.performanceForm.reset();
  }

  async editReview(performance: Performance) {
    console.log('editReview method called with performance:', performance);
    this.activePerformanceId = performance.id;
    this.activeInterviewId = null;
    this.struggledAnswerId = performance.struggled_answer_id ?? null;
    this.wellAnsweredAnswerId = performance.well_answered_answer_id ?? null;

    const userId = this.authService.getCurrentUserId();

    // Fetch answers by question and user IDs
    const [struggledAnswer, wellAnsweredAnswer] = await Promise.all([
      typeof performance.struggled_question_id === 'number' && userId !== null
        ? this.answerService.getAnswersByQuestionIdAndUserId(performance.struggled_question_id, userId).toPromise()
        : null,
      typeof performance.well_answered_question_id === 'number' && userId !== null
        ? this.answerService.getAnswersByQuestionIdAndUserId(performance.well_answered_question_id, userId).toPromise()
        : null,
    ]);

    console.log('Form Values before patch:', this.performanceForm.value);
    this.performanceForm.setValue({
      confidence_rating: performance.confidence_rating,
      technical_rating: performance.technical_rating,
      behavioral_rating: performance.behavioral_rating,
      overall_feeling: performance.overall_feeling,
      summary: performance.summary,
      struggled_question: performance.struggled_question_id,
      struggled_answer: struggledAnswer ? (struggledAnswer.length > 0 ? struggledAnswer[0].answer_text : '') : '',
      well_answered_question: performance.well_answered_question_id,
      well_answered_answer: wellAnsweredAnswer ? (wellAnsweredAnswer.length > 0 ? wellAnsweredAnswer[0].answer_text : '') : '',
    });

    console.log('Form Values after patch:', this.performanceForm.value);
    this.cdr.detectChanges();
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

  async submitReview() {
    if (this.performanceForm.valid && this.activeInterviewId !== null) {
      try {
        const formValues = this.performanceForm.value;

        // Create answers first and get their IDs
        const struggledAnswer = await this.answerService.createAnswer(formValues.struggled_answer, formValues.struggled_question).toPromise();
        const wellAnsweredAnswer = await this.answerService.createAnswer(formValues.well_answered_answer, formValues.well_answered_question).toPromise();

        // Prepare performance data with answer IDs
        const performanceData = {
          ...formValues,
          interview_id: this.activeInterviewId,
          struggled_question_id: formValues.struggled_question,
          struggled_answer_id: struggledAnswer.id,
          well_answered_question_id: formValues.well_answered_question,
          well_answered_answer_id: wellAnsweredAnswer.id
        };

        // Create performance
        const performance = await this.performanceService.createPerformance(performanceData).toPromise();
        if (performance) { // Check if performance is defined
          this.completedReviews.push(performance);
        } else {
          // Handle the case where performance is undefined
          console.error('Failed to create performance');
        }
        this.activeInterviewId = null;
      } catch (error) {
        console.error('Error creating performance or answers:', error);
      }
    }
  }


  cancelReview() {
    this.activeInterviewId = null;
    this.activePerformanceId = null;
    this.performanceForm.reset();
  }

  async updateReview() {
    if (this.performanceForm.valid && this.activePerformanceId !== null) {
      try {
        const formValues = this.performanceForm.value;

        // Update answers only if IDs are available
        if (this.struggledAnswerId && this.wellAnsweredAnswerId) {
          await this.answerService.updateAnswer(this.struggledAnswerId, formValues.struggled_answer).toPromise();
          await this.answerService.updateAnswer(this.wellAnsweredAnswerId, formValues.well_answered_answer).toPromise();
        } else {
          console.error('Answer IDs are undefined');
          return; // Exit the function if IDs are missing
        }

        // Prepare updated performance data
        const updatedPerformanceData = {
          ...formValues,
          struggled_answer_id: this.struggledAnswerId,
          well_answered_answer_id: this.wellAnsweredAnswerId
        };

        // Update performance
        const updatedPerformance = await this.performanceService.updatePerformance(this.activePerformanceId, updatedPerformanceData).toPromise();
        if (updatedPerformance) {
          const index = this.completedReviews.findIndex(p => p.id === updatedPerformance.id);
          if (index !== -1) {
            this.completedReviews[index] = updatedPerformance;
          }
          this.activePerformanceId = null; // Reset after updating
        }
      } catch (error) {
        console.error('Error updating performance or answers:', error);
      }
    }
  }
}
