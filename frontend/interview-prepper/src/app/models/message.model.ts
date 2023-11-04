export interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  content: string;
  created_at: Date;
  updated_at: Date;
  read: boolean;
}