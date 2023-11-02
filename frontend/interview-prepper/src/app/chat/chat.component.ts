import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth-service';
import { ChatService } from '../services/chat.service';
import { ConversationService } from '../services/conversation.service';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  messages: any[] = [];
  newMessageContent = '';
  conversations: any[] = [];
  selectedConversationId: number | null = null;
  recipientUsername: string = '';

  constructor(
    private messageService: MessageService,
    private conversationService: ConversationService,
    private chatService: ChatService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadConversations();
    this.loadMessages();
  }

  loadConversations() {
    this.authService.getCurrentUser().subscribe(user => {
      if (user && user.id) {
        this.conversationService.getUserConversations(user.id).subscribe(
          (conversations: any) => {
            this.conversations = conversations;
          },
          (error) => {
            console.error('Error loading conversations:', error);
          }
        );
      } else {
        console.error('User is not logged in');
      }
    });
  }

  selectConversation(conversationId: number) {
    this.selectedConversationId = conversationId;
    this.loadMessages();
  }

  loadMessages() {
    if (this.selectedConversationId != null) {
      this.messageService.getMessagesByConversationId(this.selectedConversationId).subscribe(
        (messages) => {
          this.messages = messages;
        },
        (error) => {
          console.error('Error loading messages:', error);
        }
      );
    }
  }

  sendMessage() {
    if (!this.newMessageContent.trim()) {
      return;
    }
    if (this.selectedConversationId != null) {
      this.messageService.createMessage(this.selectedConversationId, this.newMessageContent).subscribe(
        (message) => {
          this.messages.push(message);
          this.newMessageContent = '';
        },
        (error) => {
          console.error('Error sending message:', error);
        }
      );
    }
  }

  startNewConversationAndSendMessage() {
    if (!this.recipientUsername.trim() || !this.newMessageContent.trim()) {
      alert('Please enter a valid username and message content.');
      return;
    }
  
    this.authService.getUserIdFromUsername(this.recipientUsername).subscribe(
      (response) => {
        const recipientUserId = 'userId' in response ? response.userId : response;
  
        this.authService.getCurrentUser().subscribe(
          currentUser => {
            if (currentUser && currentUser.id) {
              const userIds = [currentUser.id, recipientUserId];
              this.chatService.startNewConversation(userIds).subscribe(
                conversation => {
                  this.messageService.createMessage(conversation.id, this.newMessageContent).subscribe(
                    message => {
                      console.log('Message sent successfully:', message);
                    },
                    error => {
                      console.error('Error sending message:', error);
                    }
                  );
                },
                error => {
                  console.error('Error creating conversation:', error);
                }
              );
            } else {
              console.error('Current user is not logged in.');
            }
          },
          error => {
            console.error('Error getting current user:', error);
          }
        );
      },
      error => {
        console.error('Error getting user ID from username:', error);
      }
    );
  }
  
  
  
  
}
