
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
  import { ActivityService } from '../services/activity.service';
  import { AuthGuard } from 'src/guards/auth.guard';
  import { CreateActivityDto } from 'src/dto/activity.dto';
  @ApiBearerAuth('JWT-auth')
  @ApiTags('Activity')
  @Controller('/api/activity')
  export class ActivityController {
    constructor(private readonly activityService: ActivityService) {}
    @UseGuards(AuthGuard)
    @Post()
    @ApiOperation({ summary: 'Create activity' })
    @ApiResponse({ status: 201, description: 'OK.' })
    async createActivity(
      @Response() response,
      @Request() request,
      @Body() body: CreateActivityDto,
    ) {
      const activity = await this.activityService.create(request.user, body);
      return response.status(HttpStatus.CREATED).json({
        activity,
      });
    }
  
    @UseGuards(AuthGuard)
    @Get('/:id')
    @ApiOperation({ summary: 'Get activity of each user by id' })
    @ApiParam({
      name: 'id',
      required: true,
      description: 'id of activity',
      schema: { oneOf: [{ type: 'string' }, { type: 'integer' }] },
    })
    @ApiResponse({ status: 200, description: 'OK.' })
    async getActivityById(@Response() response, @Request() request, @Param() params) {
      const activity = await this.activityService.getById(request.user, params);
      return response.status(HttpStatus.OK).json({
        activity,
      });
    }
  
    @UseGuards(AuthGuard)
    @Get()
    @ApiOperation({ summary: 'Get all activitys of a user' })
    @ApiResponse({ status: 200, description: 'OK.' })
    async getAllActivities(@Response() response, @Request() request) {
      const sample = await this.activityService.getAll(request.user);
      return response.status(HttpStatus.OK).json({
        sample,
      });
    }
  
    @UseGuards(AuthGuard)
    @Put('/:id')
    @ApiParam({
      name: 'id',
      required: true,
      description: 'id of activity',
      schema: { oneOf: [{ type: 'string' }, { type: 'integer' }] },
    })
    @ApiOperation({ summary: 'Update a activity' })
    @ApiResponse({ status: 200, description: 'OK.' })
    async updateActivity(
      @Response() response,
      @Request() request,
      @Param() params,
      @Body() Body: CreateActivityDto,
    ) {
      const activity = await this.activityService.update(
        request.user,
        params,
        Body,
      );
      return response.status(HttpStatus.OK).json({
        activity,
      });
    }
  
    @UseGuards(AuthGuard)
    @Delete('/:id')
    @ApiParam({
      name: 'id',
      required: true,
      description: 'id of activity to delete',
      schema: { oneOf: [{ type: 'string' }, { type: 'integer' }] },
    })
    @ApiOperation({ summary: 'Delete a activity' })
    @ApiResponse({ status: 200, description: 'OK.' })
    async deleteActivity(
      @Response() response,
      @Request() request,
      @Param() params,
    ) {
      await this.activityService.delete(request.user, params);
      return response.status(HttpStatus.OK).json({
        message: 'Activity deleted successfully',
      });
    }
  }
    