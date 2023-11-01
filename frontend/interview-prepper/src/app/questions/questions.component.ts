import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, forkJoin, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Answer, Question } from '../models/question.model';
import { AnswerService } from '../services/answer.service';
import { AuthService } from '../services/auth-service';
import { QuestionService } from '../services/question.service';


@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {
  public questions: Question[] = [];
  public defaultQuestions: Question[] = [];
  editingAnswer: { questionId: number, answerId: number, text: string } | null = null;

  constructor(private cdRef: ChangeDetectorRef, private questionService: QuestionService, private answerService: AnswerService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.loadQuestions();
    this.loadDefaultQuestions();
    this.loadUserAnswers();
  }

  loadQuestions() {
    const userId = this.getCurrentUserId();
    if (userId) {
      this.questionService.getQuestionsByUserId(userId).pipe(
        tap((questions: Question[]) => {
          this.questions = questions.map(question => ({ ...question, showAnswerInput: false, newAnswerText: '' }));
        }),
        switchMap(() => {
          if (this.questions.length > 0) {
            return forkJoin(this.questions.map(question => this.loadAnswers(question.id, userId)));
          } else {
            return of([]);
          }
        }),
      ).subscribe(
        (answers: Answer[][]) => {
          if (answers.length > 0) {
            answers.forEach((answerList, index) => {
              this.questions[index].answers = answerList;
            });
          }
        },
        (error) => {
          console.error('Error loading user questions or answers:', error);
        }
      );
    } else {
      console.error('User ID is not available. User might not be logged in.');
    }
  }
  


  loadUserAnswers() {
    const userId = this.getCurrentUserId();
    if (userId) {
      this.answerService.getAnswersByUserId(userId).subscribe(
        (answers: Answer[]) => {
          this.defaultQuestions.forEach(question => {
            question.answers = answers.filter(answer => answer.question_id === question.id);
          });
          this.questions.forEach(question => {
            question.answers = answers.filter(answer => answer.question_id === question.id);
          });
        },
        (error) => {
          console.error('Error loading answers:', error);
        }
      );
    }
  }


  loadAnswers(questionId: number, userId: number): Observable<Answer[]> {
    return this.answerService.getAnswersByQuestionIdAndUserId(questionId, userId);
  }


  getCurrentUserId(): number | null {
    let userId: number | null = null;
    this.authService.getCurrentUser().subscribe(user => {
      if (user && user.id) {
        userId = user.id;
      }
    });
    return userId;
  }

  loadDefaultQuestions() {
    this.questionService.getAllDefaultQuestions().subscribe(
      (data) => {
        this.defaultQuestions = data;
      },
      (error) => {
        console.error('Error loading default questions:', error);
      }
    );
  }

  //create works
  createQuestion(): void {
    this.router.navigate(['/questions/create']);
  }

  editQuestion(questionId: number): void {
    this.router.navigate(['/questions/edit', questionId]);
  }

  //delete works
  deleteQuestion(question: Question): void {
    if (confirm('Are you sure you want to delete this question?')) {
      const userId = this.getCurrentUserId();
      if (userId !== null) {
        this.questionService.deleteQuestion(question.id).subscribe({
          next: () => {
            this.questions = this.questions.filter(q => q.id !== question.id);
            this.cdRef.detectChanges();
          },
          error: (error) => console.error('Error deleting question:', error)
        });
      } else {
        console.error('User ID is not available. User might not be logged in.');
      }
    }
  }
  
  
  
  

  showAnswerInput(question: any): void {
    question.showAnswerInput = !question.showAnswerInput;
    if (!question.newAnswerText) {
      question.newAnswerText = '';
    }
  }

  createAnswer(question: any): void {
    const answerText = question.newAnswerText.trim();
    if (answerText) {
      this.answerService.createAnswer(answerText, question.id).subscribe(
        (newAnswer) => {
          if (!question.answers) {
            question.answers = [];
          }
          question.answers.push(newAnswer);
          question.newAnswerText = '';
          question.showAnswerInput = false;
        },
        error => console.error('Error creating answer:', error)
      );
    }
  }

  editAnswer(answer: Answer, question: Question): void {
    this.editingAnswer = { questionId: question.id, answerId: answer.id, text: answer.answer_text || '' };
  }
  
  submitAnswerEdit(question: Question): void {
    console.log('submitAnswerEdit function called', question);
    if (this.editingAnswer && this.editingAnswer.text) {
      const trimmedText = this.editingAnswer.text.trim();
      if (trimmedText && question.answers) {
        const answerId = this.editingAnswer.answerId;
        this.answerService.updateAnswer(answerId, trimmedText).subscribe(
          updatedAnswer => {
            const answerIndex = question.answers!.findIndex(a => a.id === answerId);
            if (answerIndex > -1) {
              question.answers![answerIndex].answer_text = trimmedText;
            }
            this.editingAnswer = null;
          },
          error => console.error('Error updating answer:', error)
        );
      }
    }
  }
  
  cancelEdit(): void {
    this.editingAnswer = null;
  }

  deleteAnswer(answer: Answer, question: Question): void {
    if (confirm('Are you sure you want to delete this answer?')) {
      const userId = this.getCurrentUserId();
      if (userId !== null) {
        this.answerService.deleteAnswer(answer.id).subscribe(
          () => {
            const question = this.defaultQuestions.find(q => q.id === answer.question_id);
  
            if (question && Array.isArray(question.answers)) {
              const answerIndex = question.answers.findIndex(a => a.id === answer.id);
              
              if (answerIndex > -1) {
                question.answers.splice(answerIndex, 1);
              }
            }
          },
          error => console.error('Error deleting answer:', error)
        );
      } else {
        console.error('User ID is not available. User might not be logged in.');
      }
    }
  }
  
  

}
