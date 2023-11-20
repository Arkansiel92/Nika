export interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  published_at: string;
  type: string;
  text: string;
}
