import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from './user.model';

export type FriendRequestDocument = FriendRequest & Document;

@Schema()
export class FriendRequest {
  _id: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  from: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  to: User;

  @Prop({ required: true })
  accepted: boolean;

  @Prop({ default: Date.now() })
  createdAt: Date;
}

export const FriendRequestSchema = SchemaFactory.createForClass(FriendRequest);
