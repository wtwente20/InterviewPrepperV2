import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { QuestionService } from '../services/question.service';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {
  public questions: any[] = [];
  public defaultQuestions: any[] = [];

  constructor(private questionService: QuestionService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.loadQuestions();
    this.loadDefaultQuestions();
  }

  loadQuestions() {
    const userId = this.getCurrentUserId();
    if (userId) {
      this.questionService.getQuestionsByUserId(userId).subscribe(
        (data) => {
          this.questions = data;
        },
        (error) => {
          console.error('Error loading user questions:', error);
        }
      );
    } else {
      console.error('User ID is not available. User might not be logged in.');
    }
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
    //need to set up edit question component
    this.router.navigate(['/questions/edit', questionId]);
  }

  //delete works
  deleteQuestion(questionId: number): void {
    if (confirm('Are you sure you want to delete this question?')) {
      this.questionService.deleteQuestion(questionId).subscribe(
        () => this.loadQuestions(),
        error => console.error('Error deleting question:', error)
      );
    }
  }
}
