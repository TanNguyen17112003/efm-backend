import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from './user.model';
import { ApiProperty } from '@nestjs/swagger';
export type GoalDocument = Goal & Document;
@Schema()
export class Goal {
  @Prop({ required: true })
  category: string;
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  date: Date;
  @Prop({ required: true })
  target: number;
  @Prop({ required: true })
  current: number;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy: User;
}
export const GoalSchema = SchemaFactory.createForClass(Goal);
