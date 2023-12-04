import { Component, OnInit } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
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
  }

  toggleAddResourceForm(): void {
    this.showAddResourceForm = !this.showAddResourceForm;
  }

  checkAuthentication(): void {
    const token = localStorage.getItem('token');
    this.isAuthenticated = token !== null && token !== '';
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
    this.getCurrentUserId().subscribe(userId => {
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
    });
  }
  

  getCurrentUserId(): Observable<number | null> {
    return this.authService.getCurrentUser().pipe(
      map(user => user ? user.id : null),
      catchError(error => {
        console.error('Error getting current user:', error);
        return of(null);
      })
    );
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
    console.log(updatedResourceData.id);
    this.userResourceService.updateUserResource(updatedResourceData.id, updatedResourceData).subscribe(
      (updatedResource: UserResource) => {
        // find the index of the resource in the list
        const index = this.userResources.findIndex(resource => resource.id === updatedResource.id);
        
        // update the resource in the list if it's found
        if (index !== -1) {
          this.userResources[index] = updatedResource;
        }
  
        // close the edit form here
        this.cancelEditing();
  
      },
      (error) => console.error('Error updating user resource:', error)
    );
  }
  
  
  deleteUserResource(resourceId: number): void {
    if (confirm('Are you sure you want to delete this resource?')) {
      this.userResourceService.deleteUserResource(resourceId).subscribe(
        () => {
          this.userResources = this.userResources.filter(resource => resource.id !== resourceId);
          // Additional logic after deletion
        },
        (error) => console.error('Error deleting user resource:', error)
      );
    }
  }
  
  
  setEditingResource(userResource: UserResource): void {
    this.editingResource = { ...userResource };
    console.log(this.editingResource);
    // Additional logic for setting up the edit form
  }

  cancelEditing(): void {
    this.editingResource = null;
    // Additional logic for handling form cancellation
  }
}
