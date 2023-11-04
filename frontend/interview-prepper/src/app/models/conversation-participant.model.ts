export interface ConversationParticipant {
  conversationId: number;
  username: string;
  lastReadAt?: Date;
}