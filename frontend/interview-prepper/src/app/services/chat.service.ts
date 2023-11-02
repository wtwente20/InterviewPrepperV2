import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = `${environment.apiUrl}/conversations`;

  constructor(private http: HttpClient) { }

  startNewConversation(userIds: number[], title: string = 'New Conversation'): Observable<any> {
    const conversationData = {
      title,
      userIds,
    };

    return this.http.post(`${this.apiUrl}`, conversationData);
  }
}
