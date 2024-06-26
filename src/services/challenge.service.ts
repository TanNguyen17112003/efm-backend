import {
  Injectable,
  Body,
  Param,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Challenge, ChallengeDocument } from '../models/challenge.model';
import { User, UserDocument } from 'src/models/user.model';
import { CreateChallengeDto } from 'src/dto/challenge.dto';
import {
  Contribution,
  ContributionDocument,
} from 'src/models/contribution.model';
@Injectable()
export class ChallengeService {
  constructor(
    @InjectModel(Challenge.name)
    private challengeModel: Model<ChallengeDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @InjectModel(Contribution.name)
    private contributionModel: Model<ContributionDocument>,
  ) {}

  async create(
    user: User,
    @Body() body: CreateChallengeDto,
  ): Promise<Challenge> {
    const challenge = new this.challengeModel({
      ...body,
      createdBy: user,
      attendants: [user],
    });
    const savedChallenge = await challenge.save();
    return savedChallenge;
  }

  async getById(user: User, @Param() params): Promise<any> {
    const challenge = await this.challengeModel.findById(params.id).exec();
    if (!challenge) {
      throw new NotFoundException('Challenge not found');
    }
    if (
      challenge.createdBy.toString() !== user._id.toString() &&
      !challenge.attendants.some((attendantId: any) =>
        attendantId.equals(user._id),
      )
    ) {
      throw new UnauthorizedException(
        'User is not authorized to access this challenge',
      );
    }
    const attendantsInfo = await Promise.all(
      challenge.attendants.map(async (attendantId) => {
        const attendant = await this.userModel.findById(attendantId).exec();
        const contribution = await this.getContribution(attendant, params.id);
        console.log(contribution);
        return {
          name: attendant.name,
          contribution: contribution ? contribution.amount : 0,
        };
      }),
    );

    const challengeInfo = {
      _id: challenge._id,
      category: challenge.category,
      name: challenge.name,
      description: challenge.description,
      date: challenge.date,
      target: challenge.target,
      current: challenge.current,
      createdBy: challenge.createdBy,
      attendants: attendantsInfo,
      requests: challenge.requests,
    };

    return challengeInfo;
  }

  async getAll(user: User): Promise<Challenge[]> {
    const challenges = await this.challengeModel
      .find({ createdBy: user._id })
      .exec();
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

  async getAllChallengesByFriends(user: User): Promise<Challenge[]> {
    // const currentUser = await this.userModel
    //   .findById(user._id)
    //   .populate('friends');
    // const friendIds = currentUser.friends.map(
    //   (friend: User) => new Types.ObjectId(friend._id),
    // );
    // const challenges = await this.challengeModel.find({
    //   createdBy: { $in: friendIds },
    // });
    const challenges = await this.challengeModel.find({
      requests: { $in: [user._id] },
    });
    return challenges;
  }

  async attendChallenge(user: User, challengeId: string): Promise<void> {
    const challenge = await this.challengeModel.findById(challengeId);
    if (!challenge) {
      throw new Error('Challenge not found');
    }
    if (challenge.attendants.includes(user)) {
      throw new Error('User is already participating in this challenge');
    }

    challenge.attendants.push(user);
    await challenge.save();
  }

  async contributeChallenge(
    user: User,
    challengeId: string,
    amount: number,
  ): Promise<void> {
    const challenge = await this.challengeModel.findById(challengeId);
    const currentUser = await this.userModel.findById(user._id);
    if (!challenge) {
      throw new Error('Challenge not found');
    }
    if (challenge.attendants.includes(user)) {
      throw new Error('User does not participate in this challenge');
    }

    const contribution = await this.contributionModel.findOne({
      createdBy: currentUser._id,
      challenge: challenge._id,
    });

    if (!contribution) {
      await this.contributionModel.create({
        createdBy: currentUser,
        challenge: challenge,
        amount: amount,
      });
      await this.challengeModel.findByIdAndUpdate(challengeId, {
        current: challenge.current + amount,
      });
    } else {
      await this.contributionModel.findByIdAndUpdate(contribution._id, {
        amount: contribution.amount + amount,
      });
      await this.challengeModel.findByIdAndUpdate(challengeId, {
        current: challenge.current + amount,
      });
    }
  }

  async getContribution(
    user: User,
    challengeId: string,
  ): Promise<Contribution> {
    const challenge = await this.challengeModel.findById(challengeId);
    const currentUser = await this.userModel.findById(user._id);
    if (!challenge) {
      throw new Error('Challenge not found');
    }
    if (challenge.attendants.includes(user)) {
      throw new Error('User does not participate in this challenge');
    }

    const contribution = await this.contributionModel.findOne({
      createdBy: currentUser._id,
      challenge: challenge._id,
    });
    return contribution;
  }

  async getAttendedChallenges(user: User): Promise<Challenge[]> {
    const challenges = await this.challengeModel.find({
      attendants: { $in: [user._id] },
    });

    return challenges;
  }

  async sendRequest(
    user: User,
    challengeId: string,
    userId: string,
  ): Promise<void> {
    const challenge = await this.challengeModel.findById(challengeId);
    const friend = await this.userModel.findById(userId);
    if (!challenge) {
      throw new Error('Challenge not found');
    }
    if (challenge.attendants.includes(user)) {
      throw new Error('Friend is already participating in this challenge');
    }
    let flag = true;
    for (const i in challenge.requests) {
      if (new Types.ObjectId(userId).equals(challenge.requests[i]._id))
        flag = false;
    }
    if (flag) challenge.requests.push(friend);

    await challenge.save();
  }
}
