import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Conversation } from '../models/conversation.model';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {

  private apiUrl = `${environment.apiUrl}/conversations`;

  constructor(private http: HttpClient) { }

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  createInitialMessage(recipientUsername: string, messageContent: string): Observable<Conversation> {
    // The body now needs to contain both recipientUsername and messageContent
    const body = { recipientUsername, messageContent };
    return this.http.post<Conversation>(`${this.apiUrl}/start`, body, {
      headers: this.getHeaders()
    });
  }

  createConversation(recipientUsername: string, messageContent: string): Observable<Conversation> {
    const body = { recipientUsername, messageContent };
    return this.http.post<Conversation>(`${this.apiUrl}/`, body, {
      headers: this.getHeaders()
    });
  }

  getConversationById(id: number): Observable<Conversation> {
    return this.http.get<Conversation>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  getConversationsByUserId(limit: number = 20, offset: number = 0): Observable<Conversation[]> {
    return this.http.get<any>(`${this.apiUrl}?limit=${limit}&offset=${offset}`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => response.conversations)
    );
  }
  

  updateConversation(id: number, updateData: Partial<Conversation>): Observable<Conversation> {
    return this.http.put<Conversation>(`${this.apiUrl}/${id}`, updateData, {
      headers: this.getHeaders()
    });
  }

  deleteConversation(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }
}
