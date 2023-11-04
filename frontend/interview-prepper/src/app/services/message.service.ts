import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Message } from '../models/message.model';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private apiUrl = `${environment.apiUrl}/messages`;

  constructor(private http: HttpClient) { }

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  createMessage(conversationId: number, content: string): Observable<Message> {
    return this.http.post<Message>(this.apiUrl, { conversationId, content }, { headers: this.getHeaders() });
  }

  getMessagesByConversationId(conversationId: number, limit: number = 20, offset: number = 0): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/conversations/${conversationId}`, {
      headers: this.getHeaders(),
      params: new HttpParams()
        .set('limit', limit.toString())
        .set('offset', offset.toString())
    });
  }

  getMessagesByUserId(userId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/user/${userId}`, {
      headers: this.getHeaders(),
    });
  }

  getMessageById(messageId: number): Observable<Message> {
    return this.http.get<Message>(`${this.apiUrl}/${messageId}`, {
      headers: this.getHeaders()
    });
  }

  updateMessage(messageId: number, content: string): Observable<Message> {
    return this.http.put<Message>(`${this.apiUrl}/${messageId}`, { content }, { headers: this.getHeaders() });
  }

  deleteMessage(messageId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${messageId}`, {
      headers: this.getHeaders()
    });
  }
}