import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../models/user.model';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from 'src/dto/user.dto';
import { SignUpDto } from 'src/dto/user.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
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
        return {
          token: jwt.sign(payload),
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
}
