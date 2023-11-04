import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { ConversationUser } from "../models/conversation-user.model";

@Injectable({
  providedIn: 'root'
})
export class ConversationUserService {
  private apiUrl = `${environment.apiUrl}/conversationUsers`;

  constructor(private http: HttpClient) { }

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  addUsersToConversation(conversationId: number, userIds: number[]): Observable<{ message: string }> {
    const body = { conversationId, userIds };
    return this.http.post<{ message: string }>(`${this.apiUrl}`, body, { headers: this.getHeaders() });
  }

  getUsersInConversation(conversationId: number): Observable<ConversationUser[]> {
    return this.http.get<ConversationUser[]>(`${this.apiUrl}/${conversationId}`, { headers: this.getHeaders() });
  }

  updateLastReadAt(conversationId: number, userId: number, lastReadAt: Date): Observable<ConversationUser> {
    const body = { lastReadAt };
    return this.http.put<ConversationUser>(`${this.apiUrl}/${conversationId}/users/${userId}/last-read`, body, { headers: this.getHeaders() });
  }

  removeUserFromConversation(conversationId: number, userId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${conversationId}/users/${userId}`, { headers: this.getHeaders() });
  }
}
