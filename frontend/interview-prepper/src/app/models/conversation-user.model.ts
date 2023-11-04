export interface ConversationUser {
  conversation_id: number;
  user_id: number;
  last_read_at?: Date; // optional since it might be null
  created_at: Date;
  updated_at: Date;
}