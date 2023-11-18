import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PerformanceService } from '../services/performance.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Category } from '../models/category.model';
import { Interview } from '../models/interview.model';
import { Performance } from '../models/performance.model';
import { Answer, Question } from '../models/question.model';
import { AnswerService } from '../services/answer.service';
import { AuthService } from '../services/auth.service';
import { CategoryService } from '../services/category.service';
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

  showAddQuestion = false;
  newQuestionText = '';
  selectedCategoryId: number | null = null;
  categories: Category[] = [];

  constructor(
    private performanceService: PerformanceService,
    private questionService: QuestionService,
    private answerService: AnswerService,
    private categoryService: CategoryService,
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
      well_answered_answer: [{ value: '', disabled: true }, Validators.required],
      newQuestionText: ['', Validators.required],
      newQuestionCategory: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadPendingReviews();
    this.loadCompletedReviews();
    this.loadQuestions();
    this.loadAnswers();
    this.loadCategories();
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

  loadCategories() {
    this.categoryService.getAllCategories().subscribe(
      data => this.categories = data,
      error => console.error('Error loading categories:', error)
    );
  }

  startReview(interview: Interview) {
    this.activeInterviewId = interview.id;
    this.activePerformanceId = null;
    this.performanceForm.reset();
  }

  editReview(performance: Performance) {
    console.log('editReview method called with performance:', performance);

    this.performanceForm.get('newQuestionText')?.clearValidators();
    this.performanceForm.get('newQuestionText')?.updateValueAndValidity();
    this.performanceForm.get('newQuestionCategory')?.clearValidators();
    this.performanceForm.get('newQuestionCategory')?.updateValueAndValidity();

    this.activePerformanceId = performance.id;
    this.activeInterviewId = null;
    this.struggledAnswerId = performance.struggled_answer_id ?? null;
    this.wellAnsweredAnswerId = performance.well_answered_answer_id ?? null;

    // Populate the form with existing performance data
    this.performanceForm.patchValue({
      confidence_rating: performance.confidence_rating,
      technical_rating: performance.technical_rating,
      behavioral_rating: performance.behavioral_rating,
      overall_feeling: performance.overall_feeling ?? '',
      summary: performance.summary ?? '',
      struggled_question: performance.struggled_question_id ?? '',
      well_answered_question: performance.well_answered_question_id ?? '',
      // Assuming you want to populate these fields if answers exist
      struggled_answer: performance.struggledAnswer?.answer_text ?? '',
      well_answered_answer: performance.wellAnsweredAnswer?.answer_text ?? ''
    });

    console.log('Form Values after patch:', this.performanceForm.value);
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
    // Debugging form validity
    Object.keys(this.performanceForm.controls).forEach(key => {
      const control = this.performanceForm.get(key);
      if (control && control.errors) {
        console.log('Control with errors:', key, control.errors);
      }
    });

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
    console.log('Update review called');
    // Debugging form validity
    Object.keys(this.performanceForm.controls).forEach(key => {
      const control = this.performanceForm.get(key);
      if (control && control.errors) {
        console.log('Control with errors:', key, control.errors);
      }
    });

    if (this.performanceForm.valid && this.activePerformanceId !== null) {
      try {
        const formValues = this.performanceForm.value;

        // Update or create struggled answer
        if (formValues.struggled_answer.trim()) {
          if (this.struggledAnswerId) {
            await this.answerService.updateAnswer(this.struggledAnswerId, formValues.struggled_answer).toPromise();
          } else {
            const newAnswer = await this.answerService.createAnswer(formValues.struggled_answer, formValues.struggled_question).toPromise();
            this.struggledAnswerId = newAnswer.id;
          }
        }

        // Update or create well answered answer
        if (formValues.well_answered_answer.trim()) {
          if (this.wellAnsweredAnswerId) {
            await this.answerService.updateAnswer(this.wellAnsweredAnswerId, formValues.well_answered_answer).toPromise();
          } else {
            const newAnswer = await this.answerService.createAnswer(formValues.well_answered_answer, formValues.well_answered_question).toPromise();
            this.wellAnsweredAnswerId = newAnswer.id;
          }
        }

        const updatedPerformanceData = {
          ...formValues,
          struggled_answer_id: this.struggledAnswerId,
          well_answered_answer_id: this.wellAnsweredAnswerId
        };

        const updatedPerformance = await this.performanceService.updatePerformance(this.activePerformanceId, updatedPerformanceData).toPromise();
        if (updatedPerformance) {
          const index = this.completedReviews.findIndex(p => p.id === updatedPerformance.id);
          if (index !== -1) {
            this.completedReviews[index] = updatedPerformance;
          }
          this.activePerformanceId = null;
        }
      } catch (error) {
        console.error('Error updating performance or answers:', error);
      }
    } else {
      console.log('Form is invalid or active performance ID is null', {
        isValid: this.performanceForm.valid,
        activePerformanceId: this.activePerformanceId
      });
    }
  }



  addQuestion() {

    // Re-add validators for new question fields
    this.performanceForm.get('newQuestionText')?.setValidators([Validators.required]);
    this.performanceForm.get('newQuestionCategory')?.setValidators([Validators.required]);
    const newQuestionText = this.performanceForm.get('newQuestionText')?.value;
    const selectedCategoryId = this.performanceForm.get('newQuestionCategory')?.value;

    if (!newQuestionText || !selectedCategoryId) {
      // Handle invalid input
      return;
    }

    const newQuestion = {
      question_text: newQuestionText,
      category_id: selectedCategoryId
    }

    this.questionService.createQuestion(newQuestion).subscribe({
      next: (question) => {
        this.questions.push(question);
        this.showAddQuestion = false;
        this.newQuestionText = '';
        this.selectedCategoryId = null;
      },
      error: (error) => console.error('Error creating new question:', error)
    });
  }

  toggleAddQuestion() {
    this.showAddQuestion = !this.showAddQuestion;
  }

  createAnswer(answerText: string, questionId: number) {
    // Assuming this method creates an answer and returns its ID
    this.answerService.createAnswer(answerText, questionId).subscribe({
      next: (answer) => {
        // Make sure you are storing the returned answer ID
        this.struggledAnswerId = answer.id; // or this.wellAnsweredAnswerId for well-answered questions
      },
      error: (error) => console.error('Error creating answer:', error)
    });
  }

}
