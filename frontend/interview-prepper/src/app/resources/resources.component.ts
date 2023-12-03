import { Component, OnInit } from '@angular/core';
import { Resource } from '../models/resource.model';
import { UserResource } from '../models/user-resource.model';
import { AuthService } from '../services/auth.service';
import { ResourceService } from '../services/resource.service';
import { UserResourceService } from '../services/user-resource.service';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrl: './resources.component.css'
})
export class ResourcesComponent implements OnInit {
  public resources: Resource[] = [];
  public userResources: UserResource[] = [];
  public isAuthenticated: boolean = false;
  editingResource: UserResource | null = null;
  showAddResourceForm = false;

  constructor(
    private resourceService: ResourceService,
    private userResourceService: UserResourceService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadResources();
    this.checkAuthentication();
    if (this.isAuthenticated) {
      this.loadUserResources();
    }
  }

  checkAuthentication(): void {
    const userId = this.getCurrentUserId();
    this.isAuthenticated = userId !== null;
    if (this.isAuthenticated) {
      this.loadUserResources();
    }
  }

  loadResources(): void {
    this.resourceService.getResources().subscribe(
      (data: Resource[]) => {
        this.resources = data;
      },
      (error) => {
        console.error('Error fetching resources', error);
      }
    );
  }

  loadUserResources(): void {
    const userId = this.getCurrentUserId();
    if (userId) {
      this.userResourceService.getUserResourcesByUserId(userId).subscribe(
        (userResources: UserResource[]) => {
          this.userResources = userResources;
        },
        (error) => {
          console.error('Error loading user resources:', error);
        }
      );
    } else {
      console.error('User ID is not available. User might not be logged in.');
    }
  }

  getCurrentUserId(): number | null {
    return this.authService.getCurrentUserId();
  }

  createUserResource(userResourceData: UserResource): void {
    this.userResourceService.createUserResource(userResourceData).subscribe(
      (newResource: UserResource) => {
        this.userResources.push(newResource);
        // Handle any additional logic, like closing a modal or resetting a form
      },
      (error) => console.error('Error creating user resource:', error)
    );
  }

  updateUserResource(updatedResourceData: UserResource): void {
    this.userResourceService.updateUserResource(updatedResourceData.id, updatedResourceData).subscribe(
      (updatedResource: UserResource) => {
        // Update the resource in your local list, or re-fetch the list if preferred
        // Additional UI logic
      },
      (error) => console.error('Error updating user resource:', error)
    );
  }
  
  deleteUserResource(resourceId: number): void {
    this.userResourceService.deleteUserResource(resourceId).subscribe(
      () => {
        this.userResources = this.userResources.filter(resource => resource.id !== resourceId);
        // Additional UI logic
      },
      (error) => console.error('Error deleting user resource:', error)
    );
  }
  
  setEditingResource(userResource: UserResource): void {
    this.editingResource = { ...userResource };
    // Additional logic for setting up the edit form
  }

  cancelEditing(): void {
    this.editingResource = null;
    // Additional logic for handling form cancellation
  }
}
