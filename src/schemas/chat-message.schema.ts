import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChatMessageDocument = ChatMessage & Document;

@Schema({ timestamps: true })
export class ChatMessage {
  @Prop([
    {
      role: { type: String, enum: ['user', 'assistant'], required: true },
      content: { type: String },
    },
  ])
  messages: { role: string; content?: string }[];

  @Prop({ type: String })
  userId?: string;

  @Prop({ type: String })
  conversationId?: string;

  @Prop({ type: String })
  provider?: string;

  @Prop({ type: String })
  model?: string;
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);
