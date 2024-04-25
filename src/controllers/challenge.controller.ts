import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Response,
  UseGuards,
  Request,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { ChallengeService } from '../services/challenge.service';
import { AuthGuard } from 'src/guards/auth.guard';
import {
  ContributeChallengeDto,
  CreateChallengeDto,
} from 'src/dto/challenge.dto';
@ApiBearerAuth('JWT-auth')
@ApiTags('Challenge')
@Controller('/api/challenge')
export class ChallengeController {
  constructor(private readonly challengeService: ChallengeService) {}
  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create challenge' })
  @ApiResponse({ status: 201, description: 'OK.' })
  async createnewChallenge(
    @Response() response,
    @Request() request,
    @Body() body: CreateChallengeDto,
  ) {
    const challenge = await this.challengeService.create(request.user, body);
    return response.status(HttpStatus.CREATED).json({
      challenge,
    });
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  @ApiOperation({ summary: 'Get challenge of each user by id' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'id of challenge',
    schema: { oneOf: [{ type: 'string' }, { type: 'integer' }] },
  })
  @ApiResponse({ status: 200, description: 'OK.' })
  async getChallengeById(
    @Response() response,
    @Request() request,
    @Param() params,
  ) {
    const challenge = await this.challengeService.getById(request.user, params);
    return response.status(HttpStatus.OK).json({
      challenge,
    });
  }

  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all challenges of a user' })
  @ApiResponse({ status: 200, description: 'OK.' })
  async getAllChallenges(@Response() response, @Request() request) {
    const sample = await this.challengeService.getAll(request.user);
    return response.status(HttpStatus.OK).json({
      sample,
    });
  }

  @UseGuards(AuthGuard)
  @Put('/:id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'id of challenge',
    schema: { oneOf: [{ type: 'string' }, { type: 'integer' }] },
  })
  @ApiOperation({ summary: 'Update a challenge' })
  @ApiResponse({ status: 200, description: 'OK.' })
  async updateChallenge(
    @Response() response,
    @Request() request,
    @Param() params,
    @Body() Body: CreateChallengeDto,
  ) {
    const challenge = await this.challengeService.update(
      request.user,
      params,
      Body,
    );
    return response.status(HttpStatus.OK).json({
      challenge,
    });
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'id of challenge to delete',
    schema: { oneOf: [{ type: 'string' }, { type: 'integer' }] },
  })
  @ApiOperation({ summary: 'Delete a challenge' })
  @ApiResponse({ status: 200, description: 'OK.' })
  async deleteChallenge(
    @Response() response,
    @Request() request,
    @Param() params,
  ) {
    await this.challengeService.delete(request.user, params);
    return response.status(HttpStatus.OK).json({
      message: 'Challenge deleted successfully',
    });
  }

  @UseGuards(AuthGuard)
  @Get('/friends/all')
  @ApiOperation({ summary: 'Get all challenges of friends' })
  @ApiResponse({ status: 200, description: 'OK.' })
  async getAllChallengesOfFriends(@Response() response, @Request() request) {
    const challenges = await this.challengeService.getAllChallengesByFriends(
      request.user,
    );
    return response.status(HttpStatus.OK).json(challenges);
  }

  @UseGuards(AuthGuard)
  @Post('/:id/attend')
  @ApiOperation({ summary: 'Attend a challenge' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the challenge to attend',
    schema: { oneOf: [{ type: 'string' }, { type: 'integer' }] },
  })
  @ApiResponse({ status: 201, description: 'OK.' })
  async attendChallenge(
    @Response() response,
    @Request() request,
    @Param('id') id: string,
  ) {
    await this.challengeService.attendChallenge(request.user, id);
    return response
      .status(HttpStatus.CREATED)
      .json({ message: 'Attended challenge successfully' });
  }

  @UseGuards(AuthGuard)
  @Post('/:id/contribute')
  @ApiOperation({ summary: 'Contribute money to a challenge' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the challenge to attend',
    schema: { oneOf: [{ type: 'string' }, { type: 'integer' }] },
  })
  @ApiResponse({ status: 201, description: 'OK.' })
  async contributeChallenge(
    @Response() response,
    @Request() request,
    @Param('id') id: string,
    @Body() body: ContributeChallengeDto,
  ) {
    await this.challengeService.contributeChallenge(
      request.user,
      id,
      body.amount,
    );
    return response
      .status(HttpStatus.OK)
      .json({ message: 'Contribute to challenge successfully' });
  }

  @UseGuards(AuthGuard)
  @Get('/:id/contribute')
  @ApiOperation({ summary: 'Get total contribution money to a challenge' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the challenge to attend',
    schema: { oneOf: [{ type: 'string' }, { type: 'integer' }] },
  })
  @ApiResponse({ status: 201, description: 'OK.' })
  async getYourContribution(
    @Response() response,
    @Request() request,
    @Param('id') id: string,
  ) {
    const contributions = await this.challengeService.getContribution(
      request.user,
      id,
    );
    return response.status(HttpStatus.OK).json(contributions);
  }

  @UseGuards(AuthGuard)
  @Get('/friends/attended')
  @ApiOperation({ summary: 'Get all challenges attended by user' })
  @ApiResponse({ status: 200, description: 'OK.' })
  async getChallengesAttendedByUser(@Response() response, @Request() request) {
    const user = request.user;
    const challenges = await this.challengeService.getAttendedChallenges(user);
    return response.status(HttpStatus.OK).json(challenges);
  }
}
