import { Get, Controller, Post, Body, Patch, Delete, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import * as jwt from 'jsonwebtoken';

import { RolesGuard } from '../@common/guards/roles.guard';
import { User } from '../@entities/user';
import { TaskType, TaskTypeCreateDto } from '../@entities/task-type';
import { Roles } from '../@common/decorators/roles.decorator';
import { UserJWT } from '../@common/decorators/user-jwt.decorator';
import { TaskTypeService } from './tasktype.service';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiUseTags('tasktype')
@Controller('tasktype')
export class TaskTypeController {
  constructor(private readonly tasktypeService: TaskTypeService) {}

  @Get()
  @Roles('user')
  @ApiResponse({ status: 200, type: TaskType, isArray: true })
  public all() {
    return this.tasktypeService.findAll();
  }

  @Post()
  @Roles('user')
  @ApiResponse({
    status: 201,
    type: TaskType,
  })
  public create(@Body() taskTypeCreateDto: TaskTypeCreateDto) {
    return this.tasktypeService.create(taskTypeCreateDto);
  }

  @Patch()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('user')
  @ApiResponse({
    status: 200,
    description: 'The task type has been successfully updated.',
  })
  public update(@UserJWT() user: User) {
    return this.tasktypeService.update();
  }

  @Delete()
  @Roles('user')
  @ApiResponse({ status: 200 })
  public remove() {
    return this.tasktypeService.delete();
  }
}
