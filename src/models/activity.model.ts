import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from './user.model';
import { ApiProperty } from '@nestjs/swagger';
export type ActivityDocument = Activity & Document;
@Schema()
export class Activity {
  @Prop({ required: true })
  category: string;
  @Prop({ required: true })
  content: string;
  @Prop({ required: true })
  createdAt: Date;
  @Prop({required: true})
  amount: number;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy: User;
}
export const ActivitySchema = SchemaFactory.createForClass(Activity);
