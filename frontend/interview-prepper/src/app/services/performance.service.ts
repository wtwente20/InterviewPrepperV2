import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Interview } from '../models/interview.model';
import { Performance } from '../models/performance.model';

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {
  private apiUrl = `${environment.apiUrl}/performances`;

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  createPerformance(performanceData: Performance): Observable<Performance> {
    return this.http.post<Performance>(`${this.apiUrl}/`, performanceData, { headers: this.getHeaders() });
  }

  getAllPerformances(): Observable<Performance[]> {
    return this.http.get<Performance[]>(`${this.apiUrl}/`, { headers: this.getHeaders() });
  }

  getInterviewsWithoutPerformance(): Observable<Interview[]> {
    return this.http.get<Interview[]>(`${environment.apiUrl}/interviews/withoutPerformance`, { headers: this.getHeaders() });
  }

  getPerformanceById(id: number): Observable<Performance> {
    return this.http.get<Performance>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  getPerformanceByInterviewId(interviewId: number): Observable<Performance> {
    return this.http.get<Performance>(`${this.apiUrl}/byInterviewId/${interviewId}`, { headers: this.getHeaders() });
  }

  updatePerformance(id: number, performanceData: Performance): Observable<Performance> {
    return this.http.put<Performance>(`${this.apiUrl}/${id}`, performanceData, { headers: this.getHeaders() });
  }

  deletePerformance(id: number): Observable<Performance> {
    return this.http.delete<Performance>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}