import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginResponse } from '../models/login-response.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  identifier = '';
  password = '';
  errorMessage = '';

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
  }

  login() {
    if (!this.identifier || !this.password) {
      this.errorMessage = 'Username/email and password are required';
      return;
    }

    this.userService.loginUser(this.identifier, this.password).subscribe({
      next: (response: LoginResponse) => {
        this.errorMessage = ''; // Clear error message on success
        const token = response.token;
        if (token) {
          localStorage.setItem('token', token);
          this.router.navigate(['/dashboard']);
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
