import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { LoginResponse } from '../models/login-response.model';
import { AuthService } from '../services/auth-service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  identifier = '';
  password = '';
  errorMessage = '';

  constructor(private userService: UserService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  login() {
    if (!this.identifier || !this.password) {
      this.errorMessage = 'Username/email and password are required';
      return;
    }

    this.userService.loginUser(this.identifier, this.password).subscribe({
      next: (response: LoginResponse) => {
        const token = response.token;
        if (token) {
          try {
            // console.log('Token:', token);
            const decodedToken: any = jwtDecode(token);
            // console.log('Decoded Token:', decodedToken);
            if (decodedToken && decodedToken.username) {
              localStorage.setItem('token', token);
              this.authService.login(response.token);
              this.router.navigate(['/dashboard']);
            } else {
              this.errorMessage = 'Invalid token structure';
            }
          } catch (error) {
            this.errorMessage = 'Failed to decode token';
            console.error('Token decoding failed', error);
          }
        } else {
          this.errorMessage = 'Token not found in response';
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Login failed due to an unknown error';
      }
    });
  }
}
