import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from './user.model';
export type ChallengeDocument = Challenge & Document;
@Schema()
export class Challenge {
  @Prop({ required: true })
  category: string;
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  description: string;
  @Prop({ required: true })
  date: Date;
  @Prop({ required: true })
  target: number;
  @Prop({ required: true })
  current: number;
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  attendants: User[];
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  requests: User[];
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy: User;
}
export const ChallengeSchema = SchemaFactory.createForClass(Challenge);
