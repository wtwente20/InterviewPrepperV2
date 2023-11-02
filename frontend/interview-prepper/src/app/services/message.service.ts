import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

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

  getMessagesByConversationId(conversationId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/conversations/${conversationId}`, { headers: this.getHeaders() });
  }

  createMessage(conversationId: number, content: string): Observable<any> {
    return this.http.post(this.apiUrl, { conversationId, content }, { headers: this.getHeaders() });
  }
}