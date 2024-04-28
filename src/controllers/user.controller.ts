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
  Put,
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
import { SignInDto, UpdateNameDto, UpdatePasswordDto } from 'src/dto/user.dto';
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
    try {
      const userInfo = await this.userService.signup(user, this.jwtService);
      return response.status(HttpStatus.CREATED).json({
        userInfo,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        status: 'error',
        message: error.message,
      });
    }
  }

  @Post('/signin')
  @ApiOperation({ summary: 'Sign in' })
  @ApiResponse({ status: 200, description: 'OK.' })
  async SignIn(@Response() response, @Body() user: SignInDto) {
    try {
      const token = await this.userService.signin(user, this.jwtService);
      return response.status(HttpStatus.OK).json(token);
    } catch (error) {
      return response.status(HttpStatus.UNAUTHORIZED).json({
        status: 'error',
        message: 'Incorrect username or password',
      });
    }
  }

  @UseGuards(AuthGuard)
  @Put('/update-name')
  @ApiOperation({ summary: 'Update Username' })
  @ApiResponse({ status: 200, description: 'OK.' })
  @ApiBearerAuth('JWT-auth')
  async updateName(
    @Response() response,
    @Request() request,
    @Body() updateNameDto: UpdateNameDto,
  ) {
    try {
      const updatedUser = await this.userService.updateName(
        request.user,
        updateNameDto,
      );

      return response.status(HttpStatus.OK).json({
        message: 'Username updated successfully',
        user: updatedUser,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        status: 'error',
        message: error.message,
      });
    }
  }

  @UseGuards(AuthGuard)
  @Put('/update-password')
  @ApiOperation({ summary: 'Update User Password' })
  @ApiResponse({ status: 200, description: 'OK.' })
  @ApiBearerAuth('JWT-auth')
  async updatePassword(
    @Response() response,
    @Request() request,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    try {
      await this.userService.updatePassword(request.user, updatePasswordDto);

      return response.status(HttpStatus.OK).json({
        message: 'Password updated successfully',
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        status: 'error',
        message: error.message,
      });
    }
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
    try {
      const users = await this.userService.findAll();
      return response.status(HttpStatus.OK).json(users);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        status: 'error',
        message: error.message,
      });
    }
  }

  @UseGuards(AuthGuard)
  @Post('/request/:friendId')
  @ApiOperation({ summary: 'Send a friend request' })
  @ApiResponse({ status: 200, description: 'OK.' })
  @ApiBearerAuth('JWT-auth')
  async addFriend(
    @Response() response,
    @Request() request,
    @Param('friendId') friendId: string,
  ) {
    try {
      await this.userService.addFriend(request.user, friendId);
      return response
        .status(HttpStatus.OK)
        .json({ message: 'Send request successfully' });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        status: 'error',
        message: error.message,
      });
    }
  }

  @UseGuards(AuthGuard)
  @Put('/request/:requestId')
  @ApiOperation({ summary: 'Accept a friend request' })
  @ApiResponse({ status: 200, description: 'OK.' })
  @ApiBearerAuth('JWT-auth')
  async acceptRequest(
    @Response() response,
    @Request() request,
    @Param('requestId') requestId: string,
  ) {
    try {
      await this.userService.acceptRequest(request.user, requestId);
      return response
        .status(HttpStatus.OK)
        .json({ message: 'Friend request accepted successfully' });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        status: 'error',
        message: error.message,
      });
    }
  }

  @UseGuards(AuthGuard)
  @Put('/request/:requestId/reject')
  @ApiOperation({ summary: 'Reject a friend request' })
  @ApiResponse({ status: 200, description: 'OK.' })
  @ApiBearerAuth('JWT-auth')
  async reject(
    @Response() response,
    @Request() request,
    @Param('requestId') requestId: string,
  ) {
    try {
      await this.userService.rejectRequest(request.user, requestId);
      return response
        .status(HttpStatus.OK)
        .json({ message: 'Friend request rejected successfully' });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        status: 'error',
        message: error.message,
      });
    }
  }

  @UseGuards(AuthGuard)
  @Get('/request')
  @ApiOperation({ summary: 'Get all friend requests' })
  @ApiResponse({ status: 200, description: 'OK.' })
  @ApiBearerAuth('JWT-auth')
  async getRequest(@Response() response, @Request() request) {
    try {
      const requests = await this.userService.getRequests(request.user);
      return response.status(HttpStatus.OK).json(requests);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        status: 'error',
        message: error.message,
      });
    }
  }

  @UseGuards(AuthGuard)
  @Get('/my-request')
  @ApiOperation({ summary: 'Get all friend requests' })
  @ApiResponse({ status: 200, description: 'OK.' })
  @ApiBearerAuth('JWT-auth')
  async getMyRequest(@Response() response, @Request() request) {
    try {
      const requests = await this.userService.getMyRequests(request.user);
      return response.status(HttpStatus.OK).json(requests);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        status: 'error',
        message: error.message,
      });
    }
  }

  @UseGuards(AuthGuard)
  @Get('/friends')
  @ApiOperation({ summary: 'Get list of friends' })
  @ApiResponse({ status: 200, description: 'OK.' })
  @ApiBearerAuth('JWT-auth')
  async getListOfFriends(@Response() response, @Request() request) {
    try {
      const friends = await this.userService.getListOfFriends(request.user);
      return response.status(HttpStatus.OK).json(friends);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        status: 'error',
        message: error.message,
      });
    }
  }
}
