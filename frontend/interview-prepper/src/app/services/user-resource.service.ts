import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserResource } from '../models/user-resource.model';

@Injectable({
  providedIn: 'root'
})
export class UserResourceService {

  private apiUrl = `${environment.apiUrl}/userResources`;

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  createUserResource(userResourceData: UserResource): Observable<UserResource> {
    return this.http.post<UserResource>(this.apiUrl, userResourceData, { headers: this.getHeaders() });
  }

  getUserResourcesByUserId(userId: number): Observable<UserResource[]> {
    return this.http.get<UserResource[]>(`${this.apiUrl}/user/${userId}`, { headers: this.getHeaders() });
  }

  updateUserResource(id: number, userResourceData: UserResource): Observable<UserResource> {
    return this.http.put<UserResource>(`${this.apiUrl}/${id}`, userResourceData, { headers: this.getHeaders() });
  }

  deleteUserResource(id: number): Observable<UserResource> {
    return this.http.delete<UserResource>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}