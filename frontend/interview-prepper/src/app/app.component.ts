import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  username!: string;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getUserDetails().subscribe(user => {
      this.username = user.username;
    });
  }

  logout() {
    this.userService.logout();
  }

  toggleSidenav() {
    this.sidenav.toggle();
  }
}

