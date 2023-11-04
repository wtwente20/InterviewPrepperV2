import { User } from "./user.model";

export interface Conversation {
  id: number;
  created_by?: number;
  created_at?: Date;
  updated_at?: Date;
  sender_name?: string;
  last_message_content?: string;
  unread_count?: number;
  participants?: User[];
}