import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css'],
})
export class AccountSettingsComponent implements OnInit {
  userDetails: any;
  isEditMode = false;

  constructor(private userService: UserService, public dialog: MatDialog, private router: Router) {}

  ngOnInit(): void {
    this.fetchUserDetails();
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
  }

  fetchUserDetails() {
    this.userService.getUserDetails().subscribe(
      (data) => {
        // console.log('Fetched user details:', data);
        this.userDetails = data;
      },
      (error) => {
        console.error('Error fetching user details', error);
      }
    );
  }

  openConfirmDialog(message: string): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: message
    });
  
    return dialogRef.afterClosed();
  }

  deactivateAccount() {
    this.openConfirmDialog('Do you really want to deactivate your account?').subscribe(
      result => {
        if (result) {
          this.userService.deactivateUser().subscribe(
            () => {
              console.log('Account deactivated');
              this.handleUserInactive();
            },
            (error) => {
              console.error('Error deactivating account', error);
            }
          );
        }
      }
    );
  }
  
  deleteAccount() {
    this.openConfirmDialog('Do you really want to delete your account? This action cannot be undone.').subscribe(
      result => {
        if (result) {
          this.userService.deleteUser().subscribe(
            (response) => {
              console.log('Account deleted', response);
              localStorage.removeItem('token');
              this.router.navigate(['/login']);
            },
            (error) => {
              console.error('Error deleting account', error);
            }
          );
        }
      }
    );
  }
  
  private handleUserInactive() {
    // Redirect user or update UI
    this.router.navigate(['/login']);
    // You might also want to clear any user data from local storage or state management
  }
  

  updateDetails(details: any) {
    this.userService.updateUserDetails(details).subscribe(
      (response) => {
        console.log('Details updated', response);
        this.isEditMode = false;
      },
      (error) => {
        console.error('Error updating details', error);
      }
    );
  }
}
