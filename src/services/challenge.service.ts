import {
    Injectable,
    Body,
    Param,
    NotFoundException,
    UnauthorizedException,
  } from '@nestjs/common';
  import { InjectModel } from '@nestjs/mongoose';
  import { Model } from 'mongoose';
  import { Challenge, ChallengeDocument } from '../models/challenge.model';
  import { User } from 'src/models/user.model';
  import { CreateChallengeDto } from 'src/dto/challenge.dto';
  @Injectable()
  export class ChallengeService {
    constructor(
      @InjectModel(Challenge.name) private challengeModel: Model<ChallengeDocument>,
    ) {}
  
    async create(user: User, @Body() body: CreateChallengeDto): Promise<Challenge> {
      const challenge = new this.challengeModel({ ...body, createdBy: user });
      const savedChallenge = await challenge.save();
      return savedChallenge
    }
  
    async getById(user: User, @Param() params): Promise<Challenge> {
      const challenge = await this.challengeModel.findById(params.id).exec();
  
      // If you want to include creator info in sample
      // const sample = await this.sampleModel
      // .findOne({ _id: params.id })
      // .populate('createdBy')
      // .exec();
      if (!challenge) {
        throw new NotFoundException('Challenge not found');
      }
      //Authorization
      if (challenge.createdBy.toString() !== user._id.toString()) {
        throw new UnauthorizedException(
          'User is not authorized to access this challenge',
        );
      }
      return challenge;
    }
  
    async getAll(user: User): Promise<Challenge[]> {
      const challenges = await this.challengeModel.find({ createdBy: user._id }).exec();
      if (!challenges || challenges.length === 0) {
        throw new NotFoundException('No samples found');
      }
      return challenges;
    }
  
    async update(
      user: User,
      @Param() params,
      @Body() body: CreateChallengeDto,
    ): Promise<Challenge> {
      const challenge = await this.challengeModel.findById(params.id).exec();
      if (!challenge) {
        throw new NotFoundException('Challenge not found');
      }
      if (challenge.createdBy.toString() !== user._id.toString()) {
        throw new UnauthorizedException(
          'User is not authorized to update this challenge',
        );
      }
      challenge.category = body.category;
      challenge.name = body.name;
      challenge.description = body.description;
      challenge.date = body.date;
      challenge.target = body.target;
      challenge.current = body.current;
      const updatedChallenge = await challenge.save();
      return updatedChallenge;
    }
  
    async delete(user: User, @Param() params): Promise<void> {
      const challenge = await this.challengeModel.findById(params.id).exec();
      if (!challenge) {
        throw new NotFoundException('challenge not found');
      }
  
      if (challenge.createdBy.toString() !== user._id.toString()) {
        throw new UnauthorizedException(
          'User is not authorized to access this challenge',
        );
      }
      await this.challengeModel.findByIdAndDelete(params.id).exec();
    }
  }
  