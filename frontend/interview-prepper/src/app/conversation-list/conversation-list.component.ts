import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Conversation } from '../models/conversation.model';
import { ConversationService } from '../services/conversation.service';

@Component({
  selector: 'app-conversation-list',
  templateUrl: './conversation-list.component.html',
  styleUrls: ['./conversation-list.component.css']
})
export class ConversationListComponent implements OnInit {
  @Output() onConversationSelected = new EventEmitter<Conversation>();
  @Input() conversations: Conversation[] = [];

  showCreateConversationForm: boolean = false;
  recipientUsername: string = '';
  messageContent: string = '';
  selectedConversationId: number | null = null;

  constructor(private conversationService: ConversationService, private changeDetector: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.fetchConversations();
  }

  fetchConversations(): void {
    this.conversationService.getConversationsByUserId().subscribe(
      (conversations) => {
        this.conversations = conversations;
        this.changeDetector.detectChanges();
      },
      (error) => {
        // TODO: handle errors, e.g. show a message to the user
      }
    );
  }

  selectConversation(conversation: Conversation): void {
    this.selectedConversationId = conversation.id;
    this.onConversationSelected.emit(conversation);
  }

  createNewConversation(): void {
    // Call the service to create a new conversation
    this.conversationService.createConversation(this.recipientUsername, this.messageContent).subscribe(
      (newConversation) => {
        this.conversations.unshift(newConversation);
        this.selectConversation(newConversation);
      },
      (error) => {
        // TODO: handle errors, e.g., show a message to the user
      }
    );
  }

  trackByConversationId(index: number, conversation: Conversation): number {
    return conversation.id;
  }
}

