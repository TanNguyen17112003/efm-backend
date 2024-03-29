import {
    Injectable,
    Body,
    Param,
    NotFoundException,
    UnauthorizedException,
  } from '@nestjs/common';
  import { InjectModel } from '@nestjs/mongoose';
  import { Model } from 'mongoose';
  import { Activity, ActivityDocument } from '../models/activity.model';
  import { User } from 'src/models/user.model';
  import { CreateActivityDto } from 'src/dto/activity.dto';
  @Injectable()
  export class ActivityService {
    constructor(
      @InjectModel(Activity.name) private activityModel: Model<ActivityDocument>,
    ) {}
  
    async create(user: User, @Body() body: CreateActivityDto): Promise<Activity> {
      const activity = new this.activityModel({ ...body, createdBy: user });
      const savedActivity = await activity.save();
      return savedActivity
    }
  
    async getById(user: User, @Param() params): Promise<Activity> {
      const activity = await this.activityModel.findById(params.id).exec();
  
      // If you want to include creator info in sample
      // const sample = await this.sampleModel
      // .findOne({ _id: params.id })
      // .populate('createdBy')
      // .exec();
      if (!activity) {
        throw new NotFoundException('Activity not found');
      }
      //Authorization
      if (activity.createdBy.toString() !== user._id.toString()) {
        throw new UnauthorizedException(
          'User is not authorized to access this activity',
        );
      }
      return activity;
    }
  
    async getAll(user: User): Promise<Activity[]> {
      const activities = await this.activityModel.find({ createdBy: user._id }).exec();
      if (!activities || activities.length === 0) {
        throw new NotFoundException('No activities found');
      }
      return activities;
    }
  
    async update(
      user: User,
      @Param() params,
      @Body() body: CreateActivityDto,
    ): Promise<Activity> {
      const activity = await this.activityModel.findById(params.id).exec();
      if (!activity) {
        throw new NotFoundException('Activity not found');
      }
      if (activity.createdBy.toString() !== user._id.toString()) {
        throw new UnauthorizedException(
          'User is not authorized to update this activity',
        );
      }
      activity.content = body.content;
      activity.category = body.category;
      activity.createdAt = body.createdAt;
      activity.amount = body.amount;
      const updatedActivity = await activity.save();
      return updatedActivity;
    }
  
    async delete(user: User, @Param() params): Promise<void> {
      const activity = await this.activityModel.findById(params.id).exec();
      if (!activity) {
        throw new NotFoundException('activity not found');
      }
  
      if (activity.createdBy.toString() !== user._id.toString()) {
        throw new UnauthorizedException(
          'User is not authorized to access this activity',
        );
      }
      await this.activityModel.findByIdAndDelete(params.id).exec();
    }
  }
  