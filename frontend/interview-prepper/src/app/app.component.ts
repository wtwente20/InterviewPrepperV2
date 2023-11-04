import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  username!: string;
  private subscription = new Subscription();
  messageCount = 0;
  showMessages = false;
  private apiUrl = `${environment.apiUrl}/messages`;
  userId!: number;

  constructor(public dialog: MatDialog, private http: HttpClient, private userService: UserService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.subscription.add(
      this.authService.getCurrentUser().subscribe(user => {
        this.username = user?.username || '';
        this.userId = Number(user?.id) || 0;
      })
    );
    this.loadMessageCount();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout() {
    this.userService.logout();
  }

  toggleSidenav() {
    this.sidenav.toggle();
  }

  loadMessageCount() {
    this.http.get<any[]>(`${this.apiUrl}/user/${this.userId}`).subscribe(
      (messages) => {
        this.messageCount = messages.length;
      },
      (error) => {
        console.error('Error loading message count:', error);
      }
    );
  }

  toggleMessages() {
    this.showMessages = !this.showMessages;
  }

  openChat(): void {
    this.router.navigate(['/chat']);
  }
}

