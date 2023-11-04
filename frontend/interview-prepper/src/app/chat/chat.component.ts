import { Component, OnInit } from '@angular/core';
import { Conversation } from '../models/conversation.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  conversations: Conversation[] = [];
  selectedConversation: Conversation | null = null;
  
  constructor() { }

  ngOnInit(): void { }

  onConversationSelected(conversation: Conversation): void {
    this.selectedConversation = conversation;
  }
}