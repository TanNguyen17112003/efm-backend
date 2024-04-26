import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../models/user.model';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from 'src/dto/user.dto';
import { SignUpDto } from 'src/dto/user.dto';
import {
  FriendRequest,
  FriendRequestDocument,
} from 'src/models/friendRequest.model';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(FriendRequest.name)
    private readonly friendRequestModel: Model<FriendRequestDocument>,
  ) {}
  async signup(
    user: SignUpDto,
    jwt: JwtService,
  ): Promise<{ info: User; token: string }> {
    if (!user.name || !user.email || !user.password) {
      throw new HttpException(
        'Name, email, and password are required',
        HttpStatus.BAD_REQUEST,
      );
    }
    const existingUser = await this.userModel
      .findOne({ email: user.email })
      .exec();
    if (existingUser) {
      throw new HttpException(
        'Email is already in use',
        HttpStatus.BAD_REQUEST,
      );
    }
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(user.password, salt);
    const reqBody = {
      name: user.name,
      email: user.email,
      password: hash,
    };
    const newUser = new this.userModel(reqBody);
    const savedUser = await newUser.save();
    const payload = { email: user.email };
    const token = jwt.sign(payload);
    return {
      info: savedUser,
      token: token,
    };
  }
  async signin(user: SignInDto, jwt: JwtService): Promise<any> {
    const foundUser = await this.userModel
      .findOne({ email: user.email })
      .exec();
    if (foundUser) {
      const { password } = foundUser;
      const comparison = await bcrypt.compare(user.password, password);
      if (comparison) {
        const payload = { email: user.email };
        const { name } = foundUser;
        return {
          token: jwt.sign(payload),
          name: name,
        };
      }
      return new HttpException(
        'Incorrect username or password',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return new HttpException(
      'Incorrect username or password',
      HttpStatus.UNAUTHORIZED,
    );
  }
  async getByEmail(email: string): Promise<User> {
    const foundUser = await this.userModel.findOne({ email: email }).exec();
    return foundUser;
  }

  async findAll(): Promise<{ id: string; name: string }[]> {
    const users = await this.userModel.find().select('_id name');
    return users.map((user) => ({ id: user._id.toString(), name: user.name }));
  }

  async addFriend(user: User, friendId: string): Promise<void> {
    const currentUser = await this.userModel.findById(user._id);
    const friend = await this.userModel.findById(friendId);
    if (!currentUser || !friend) {
      throw new Error('User or friend not found');
    }
    if (
      currentUser.friends.includes(friend) ||
      friend.friends.includes(currentUser)
    ) {
      throw new Error('Users are already friends');
    }

    const existingRequest = await this.friendRequestModel.findOne({
      from: currentUser._id,
      to: friend._id,
      accepted: false,
    });

    if (existingRequest) {
      throw new Error('Request has already been sent to this user');
    }

    await this.friendRequestModel.create({
      from: currentUser,
      to: friend,
      accepted: false,
    });
  }

  async acceptRequest(user: User, requestId: string): Promise<void> {
    const currentUser = await this.userModel.findById(user._id);
    const request = await this.friendRequestModel.findById(requestId);
    if (!currentUser || !request) {
      throw new Error('User or request not found');
    }

    if (request.to.toString() !== currentUser._id.toString()) {
      throw new Error('You do not have permission to accept this request');
    }

    await this.friendRequestModel.findByIdAndUpdate(requestId, {
      accepted: true,
    });

    const friend = await this.userModel.findOne(request.from);
    currentUser.friends.push(friend);
    friend.friends.push(currentUser);
    await currentUser.save();
    await friend.save();
  }

  async rejectRequest(user: User, requestId: string): Promise<void> {
    const currentUser = await this.userModel.findById(user._id);
    const request = await this.friendRequestModel.findById(requestId);
    if (!currentUser || !request) {
      throw new Error('User or request not found');
    }

    if (request.to.toString() !== currentUser._id.toString()) {
      throw new Error('You do not have permission to reject this request');
    }

    await this.friendRequestModel.findByIdAndDelete(requestId);
  }

  async getRequests(user: User): Promise<FriendRequest[]> {
    const currentUser = await this.userModel.findById(user._id);
    if (!currentUser) {
      throw new Error('Current user not found');
    }
    const requests = await this.friendRequestModel
      .find({
        to: currentUser._id,
        accepted: false,
      })
      .populate('from', 'name');
    return requests;
  }

  async getMyRequests(user: User): Promise<FriendRequest[]> {
    const currentUser = await this.userModel.findById(user._id);
    if (!currentUser) {
      throw new Error('Current user not found');
    }
    const requests = await this.friendRequestModel
      .find({
        from: currentUser._id,
        accepted: false,
      })
      .populate('from', 'name');
    return requests;
  }

  async getListOfFriends(user: User): Promise<UserDocument[]> {
    const currentUser = await this.userModel.findById(user._id);
    const friends = await this.userModel.find(
      {
        _id: { $in: currentUser.friends },
      },
      { _id: 1, name: 1 },
    );
    return friends;
  }
}
