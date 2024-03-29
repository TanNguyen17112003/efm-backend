
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
  import { CreateChallengeDto } from 'src/dto/challenge.dto';
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
    async getChallengeById(@Response() response, @Request() request, @Param() params) {
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
  }
    