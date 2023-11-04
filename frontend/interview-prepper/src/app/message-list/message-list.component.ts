import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Conversation } from '../models/conversation.model';
import { Message } from '../models/message.model';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit {
  @Input() conversation: Conversation | null = null;
  @Input() messages: Message[] = [];
  newMessageContent: string = '';
  recipientUsername: string = '';
  hasSelectedConversation: boolean = false;
  showNewMessageInput: boolean = false;

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    if (this.conversation) {
      this.loadMessages();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['conversation'] && changes['conversation'].previousValue !== changes['conversation'].currentValue) {
      if (this.conversation) {
        this.hasSelectedConversation = true;
        this.loadMessages();
      } else {
        this.hasSelectedConversation = false;
      }
    }
  }

  loadMessages() {
    if (this.conversation?.id) {
      this.messageService.getMessagesByConversationId(this.conversation.id).subscribe(messages => {
        console.log(messages);
        this.messages = messages;
      }, error => {
        console.error(error);
      });
    }
  }

  sendMessage(): void {
    if (this.conversation && this.newMessageContent.trim()) {
      this.messageService.createMessage(this.conversation.id, this.newMessageContent).subscribe(
        (msg) => {
          this.messages.push(msg);
          this.newMessageContent = '';
        },
        (error) => {
          // TODO: handle errors, e.g., show a message to the user
        }
      );
    }
  }

  toggleNewMessageInput() {
    this.showNewMessageInput = !this.showNewMessageInput;
  }
}

