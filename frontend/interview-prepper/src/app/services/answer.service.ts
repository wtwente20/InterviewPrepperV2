import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Answer } from '../models/question.model';

@Injectable({
  providedIn: 'root'
})
export class AnswerService {
  private apiUrl = `${environment.apiUrl}/answers`;

  constructor(private http: HttpClient) { }

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  createAnswer(answerText: string, questionId: number): Observable<any> {
    const body = { answer_text: answerText, question_id: questionId };
    return this.http.post(`${this.apiUrl}`, body, { headers: this.getHeaders() });
  }

  getAnswersByUserId(userId: number): Observable<Answer[]> {
    return this.http.get<Answer[]>(`${this.apiUrl}/user/${userId}`, { headers: this.getHeaders() });
  }

  getAnswersByQuestionIdAndUserId(questionId: number, userId: number): Observable<Answer[]> {
    return this.http.get<Answer[]>(`${this.apiUrl}/question/${userId}/${questionId}`, { headers: this.getHeaders() });
  }

  updateAnswer(answerId: number, updatedContent: string): Observable<any> {
    const body = { answer_text: updatedContent };
    return this.http.put(`${this.apiUrl}/${answerId}`, body, { headers: this.getHeaders() });
  }

  deleteAnswer(answerId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${answerId}`, { headers: this.getHeaders() });
  }
}
