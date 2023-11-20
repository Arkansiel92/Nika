export interface Message {
  id: string;
  text: string;
  type: string;
  sender_id: number;
  receiver_id: number;
  content: string;
  published_at: Date;
}
