import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginResponse } from '../models/login-response.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;
  private isActive: boolean = true;

  constructor(private http: HttpClient, private router: Router) { }

  registerUser(username: string, email: string, password: string, status: string) {
    return this.http.post(`${this.apiUrl}/users/register`, { username, email, password, status });
  }

  loginUser(identifier: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/users/login`, { identifier, password });
  }

  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const body = { oldPassword, newPassword };
    return this.http.put(`${this.apiUrl}/users/change-password`, body, { headers });
  }

  deactivateUser(): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/deactivate`, {}).pipe(
      tap(() => this.isActive = false)
    );
  }

  deleteUser(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/delete`).pipe(
      tap(()=> this.isActive = false)
    );
  }

  getIsActive(): boolean {
    return this.isActive;
  }

  updateUserDetails(details: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.patch(`${this.apiUrl}/users/details`, details, { headers });
  }
  

  getUserDetails(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/details`);
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
