import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Response,
  Get,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from 'src/guards/auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SignInDto } from 'src/dto/user.dto';
import { SignUpDto } from 'src/dto/user.dto';

@ApiTags('Authentication')
@Controller('/api/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  @ApiOperation({ summary: 'Sign up' })
  @ApiResponse({ status: 200, description: 'OK.' })
  @Post('/signup')
  async Signup(@Response() response, @Body() user: SignUpDto) {
    const userInfo = await this.userService.signup(user, this.jwtService);
    return response.status(HttpStatus.CREATED).json({
      userInfo,
    });
  }
  @Post('/signin')
  @ApiOperation({ summary: 'Sign in' })
  @ApiResponse({ status: 200, description: 'OK.' })
  async SignIn(@Response() response, @Body() user: SignInDto) {
    const token = await this.userService.signin(user, this.jwtService);
    return response.status(HttpStatus.OK).json(token);
  }

  @UseGuards(AuthGuard)
  @Get('/profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'OK.' })
  @ApiBearerAuth('JWT-auth')
  async get(@Response() response, @Request() request) {
    return response.status(HttpStatus.OK).json(request.user);
  }

  @UseGuards(AuthGuard)
  @Get('/all')
  @ApiOperation({ summary: 'Get all available users using this application' })
  @ApiResponse({ status: 200, description: 'OK.' })
  @ApiBearerAuth('JWT-auth')
  async getAllUsers(@Response() response) {
    const users = await this.userService.findAll();
    return response.status(HttpStatus.OK).json(users);
  }

  @UseGuards(AuthGuard)
  @Post('/add-friend/:friendId')
  @ApiOperation({ summary: 'Add a friend' })
  @ApiResponse({ status: 200, description: 'OK.' })
  @ApiBearerAuth('JWT-auth')
  async addFriend(
    @Response() response,
    @Request() request,
    @Param('friendId') friendId: string,
  ) {
    await this.userService.addFriend(request.user, friendId);
    return response
      .status(HttpStatus.OK)
      .json({ message: 'Friend added successfully' });
  }

  @UseGuards(AuthGuard)
  @Get('/friends')
  @ApiOperation({ summary: 'Get list of friends' })
  @ApiResponse({ status: 200, description: 'OK.' })
  @ApiBearerAuth('JWT-auth')
  async getListOfFriends(@Response() response, @Request() request) {
    const friends = await this.userService.getListOfFriends(request.user);
    return response.status(HttpStatus.OK).json(friends);
  }
}
