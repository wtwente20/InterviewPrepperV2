import { Component, OnInit } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  username: string;

  constructor(private userService: UserService) {
    this.username = '';
  }

  ngOnInit(): void {
    // Assuming the token is stored in local storage after login
    const token = localStorage.getItem('token');

    if (token) {
      try {
        // Decode the token to get user data
        const decoded: any = jwtDecode(token);
        if (decoded && decoded.username) {
          this.username = decoded.username;
        } else {
          console.error('Invalid token structure:', decoded);
        }
      } catch (error) {
        console.error('Token decoding failed:', error);
      }
    } else {
      // Handle the case where the token is not available
      console.error('No token found');
    }
  }

  logout() {
    this.userService.logout();
  }
}
