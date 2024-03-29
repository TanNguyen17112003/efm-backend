import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from './user.model';
import { ApiProperty } from '@nestjs/swagger';
export type GoalDocument = Goal & Document;
@Schema()
export class Goal {
  @ApiProperty({
    example: 'Content of sample',
    description: 'Content of sample',
  })
  @Prop({ required: true })
  content: string;
  @Prop({ default: Date.now() })
  createdAt: Date;
  @Prop({ required: true })
  dueDate: Date;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy: User;
}
export const GoalSchema = SchemaFactory.createForClass(Goal);
