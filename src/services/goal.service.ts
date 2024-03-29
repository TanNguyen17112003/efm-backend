import {
    Injectable,
    Body,
    Param,
    NotFoundException,
    UnauthorizedException,
  } from '@nestjs/common';
  import { InjectModel } from '@nestjs/mongoose';
  import { Model } from 'mongoose';
  import { Goal, GoalDocument } from '../models/goal.model';
  import { User } from 'src/models/user.model';
  import { CreateGoalDto } from 'src/dto/goal.dto';
  @Injectable()
  export class GoalService {
    constructor(
      @InjectModel(Goal.name) private goalModel: Model<GoalDocument>,
    ) {}
  
    async create(user: User, @Body() body: CreateGoalDto): Promise<Goal> {
      const goal = new this.goalModel({ ...body, createdBy: user });
      const savedGoal = await goal.save();
      return savedGoal
    }
  
    async getById(user: User, @Param() params): Promise<Goal> {
      const goal = await this.goalModel.findById(params.id).exec();
  
      // If you want to include creator info in sample
      // const sample = await this.sampleModel
      // .findOne({ _id: params.id })
      // .populate('createdBy')
      // .exec();
      if (!goal) {
        throw new NotFoundException('Goal not found');
      }
      //Authorization
      if (goal.createdBy.toString() !== user._id.toString()) {
        throw new UnauthorizedException(
          'User is not authorized to access this goal',
        );
      }
      return goal;
    }
  
    async getAll(user: User): Promise<Goal[]> {
      const goals = await this.goalModel.find({ createdBy: user._id }).exec();
      if (!goals || goals.length === 0) {
        throw new NotFoundException('No samples found');
      }
      return goals;
    }
  
    async update(
      user: User,
      @Param() params,
      @Body() body: CreateGoalDto,
    ): Promise<Goal> {
      const goal = await this.goalModel.findById(params.id).exec();
      if (!goal) {
        throw new NotFoundException('Goal not found');
      }
      if (goal.createdBy.toString() !== user._id.toString()) {
        throw new UnauthorizedException(
          'User is not authorized to update this goal',
        );
      }
      goal.category = body.category;
      goal.title = body.title;
      goal.date = body.date;
      goal.target = body.target;
      goal.current = body.current;
      const updatedGoal = await goal.save();
      return updatedGoal;
    }
  
    async delete(user: User, @Param() params): Promise<void> {
      const goal = await this.goalModel.findById(params.id).exec();
      if (!goal) {
        throw new NotFoundException('goal not found');
      }
  
      if (goal.createdBy.toString() !== user._id.toString()) {
        throw new UnauthorizedException(
          'User is not authorized to access this goal',
        );
      }
      await this.goalModel.findByIdAndDelete(params.id).exec();
    }
  }
  