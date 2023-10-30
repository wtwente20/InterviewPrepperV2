import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { LoginResponse } from './models/login-response.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;

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

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
