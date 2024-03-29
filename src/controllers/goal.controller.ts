
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
  import { GoalService } from '../services/goal.service';
  import { AuthGuard } from 'src/guards/auth.guard';
  import { CreateGoalDto } from 'src/dto/goal.dto';
  @ApiBearerAuth('JWT-auth')
  @ApiTags('Goal')
  @Controller('/api/goal')
  export class GoalController {
    constructor(private readonly goalService: GoalService) {}
    @UseGuards(AuthGuard)
    @Post()
    @ApiOperation({ summary: 'Create goal' })
    @ApiResponse({ status: 201, description: 'OK.' })
    async createSample(
      @Response() response,
      @Request() request,
      @Body() body: CreateGoalDto,
    ) {
      const goal = await this.goalService.create(request.user, body);
      return response.status(HttpStatus.CREATED).json({
        goal,
      });
    }
  
    @UseGuards(AuthGuard)
    @Get('/:id')
    @ApiOperation({ summary: 'Get goal of each user by id' })
    @ApiParam({
      name: 'id',
      required: true,
      description: 'id of goal',
      schema: { oneOf: [{ type: 'string' }, { type: 'integer' }] },
    })
    @ApiResponse({ status: 200, description: 'OK.' })
    async getGoal(@Response() response, @Request() request, @Param() params) {
      const goal = await this.goalService.getById(request.user, params);
      return response.status(HttpStatus.OK).json({
        goal,
      });
    }
  
    @UseGuards(AuthGuard)
    @Get()
    @ApiOperation({ summary: 'Get all goals of a user' })
    @ApiResponse({ status: 200, description: 'OK.' })
    async getAllGoals(@Response() response, @Request() request) {
      const sample = await this.goalService.getAll(request.user);
      return response.status(HttpStatus.OK).json({
        sample,
      });
    }
  
    @UseGuards(AuthGuard)
    @Put('/:id')
    @ApiParam({
      name: 'id',
      required: true,
      description: 'id of goal',
      schema: { oneOf: [{ type: 'string' }, { type: 'integer' }] },
    })
    @ApiOperation({ summary: 'Update a goal' })
    @ApiResponse({ status: 200, description: 'OK.' })
    async updateSample(
      @Response() response,
      @Request() request,
      @Param() params,
      @Body() Body: CreateGoalDto,
    ) {
      const sample = await this.goalService.update(
        request.user,
        params,
        Body,
      );
      return response.status(HttpStatus.OK).json({
        sample,
      });
    }
  
    @UseGuards(AuthGuard)
    @Delete('/:id')
    @ApiParam({
      name: 'id',
      required: true,
      description: 'id of goal to delete',
      schema: { oneOf: [{ type: 'string' }, { type: 'integer' }] },
    })
    @ApiOperation({ summary: 'Delete a goal' })
    @ApiResponse({ status: 200, description: 'OK.' })
    async deleteSample(
      @Response() response,
      @Request() request,
      @Param() params,
    ) {
      await this.goalService.delete(request.user, params);
      return response.status(HttpStatus.OK).json({
        message: 'Goal deleted successfully',
      });
    }
  }
    