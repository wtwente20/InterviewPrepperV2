import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private apiUrl = `${environment.apiUrl}/questions`;

  constructor(private http: HttpClient) { }

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Methods to interact with questions

  getQuestions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/`);
  }

  getQuestionById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  getQuestionsByUserId(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${userId}`, { headers: this.getHeaders() });
  }

  getAllDefaultQuestions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/default`);
  }

  getDefaultQuestionById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/default/${id}`);
  }

  createQuestion(question: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, question, { headers: this.getHeaders() });
  }

  updateQuestion(id: number, question: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, question, { headers: this.getHeaders() });
  }

  deleteQuestion(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
