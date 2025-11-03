import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ResearchDocDocument = ResearchDoc & Document;

@Schema({ timestamps: true })
export class ResearchDoc {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop([
    {
      heading: { type: String },
      content: { type: String },
    },
  ])
  sections?: { heading: string; content: string }[];

  @Prop([String])
  key_findings?: string[];

  @Prop([
    {
      title: { type: String },
      url: { type: String },
    },
  ])
  sources?: { title: string; url: string }[];

  @Prop({ default: 'Rust' })
  category?: string;

  @Prop([String])
  tags?: string[];
}

export const ResearchDocSchema = SchemaFactory.createForClass(ResearchDoc);
