import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from './user.model';
import { Challenge } from './challenge.model';

export type ContributionDocument = Contribution & Document;

@Schema()
export class Contribution {
  _id: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  createdBy: User;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge',
    required: true,
  })
  challenge: Challenge;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: Date.now() })
  createdAt: Date;
}

export const ContributionSchema = SchemaFactory.createForClass(Contribution);
