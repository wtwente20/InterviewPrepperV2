import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css'],
})
export class AccountSettingsComponent implements OnInit {
  userDetails: any;
  isEditMode = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.fetchUserDetails();
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
  }

  fetchUserDetails() {
    this.userService.getUserDetails().subscribe(
      (data) => {
        console.log('Fetched user details:', data);
        this.userDetails = data;
      },
      (error) => {
        console.error('Error fetching user details', error);
      }
    );
  }

  deactivateAccount() {
    this.userService.deactivateUser().subscribe(
      (response) => {
        console.log('Account deactivated', response);
      },
      (error) => {
        console.error('Error deactivating account', error);
      }
    );
  }

  deleteAccount() {
    this.userService.deleteUser().subscribe(
      (response) => {
        console.log('Account deleted', response);
      },
      (error) => {
        console.error('Error deleting account', error);
      }
    );
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
