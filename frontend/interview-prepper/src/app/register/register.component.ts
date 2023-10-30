import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  username = '';
  email = '';
  password = '';
  status = '';
  errorMessage = '';

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
  }

  register() {
    if (!this.username || !this.email || !this.password || !this.status) {
      this.errorMessage = 'All fields are required';
      return;
    }

    this.userService.registerUser(this.username, this.email, this.password, this.status).subscribe({
      next: () => {
        this.errorMessage = ''; // Clear error message on success
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Registration failed due to an unknown error';
        console.error('Registration Error:', err); // Log the error for debugging purposes
      }
    });
  }
}
