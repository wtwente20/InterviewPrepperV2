import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  constructor() {
    this.initializeCurrentUser();
  }

  private initializeCurrentUser(): void {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        if (decodedToken) {
          const user: User = {
            id: decodedToken.userId,
            username: decodedToken.username,
            email: decodedToken.email,
            role: decodedToken.role,
          };
          this.currentUserSubject.next(user);
        } else {
          console.error('Invalid token structure:', decodedToken);
        }
      } catch (error) {
        console.error('Failed to decode token:', error);
      }
    }
  }

  login(token: string): void {
    try {
      const decodedToken: any = jwtDecode(token);
      if (decodedToken) {
        const user: User = {
          id: decodedToken.userId,
          username: decodedToken.username,
          email: decodedToken.email,
          role: decodedToken.role,
          // set other properties if needed, or provide default values
        };
        this.currentUserSubject.next(user);
        localStorage.setItem('token', token);
      } else {
        console.error('Invalid token structure:', decodedToken);
      }
    } catch (error) {
      console.error('Failed to decode token:', error);
    }
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('token');
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }
}