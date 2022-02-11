import { Controller, Get, Post, Body, Put, Param, Delete, HttpException, HttpStatus, UseFilters, Res } from '@nestjs/common';
import { User } from './user.model';
import { Crud } from 'nestjs-mongoose-crud';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { UserService } from './user.service';
import { ValidationExceptionsFilter } from 'src/utils/validationExceptionsFilter';
import { UserDTO } from './user.dto';
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  async getUsers(): Promise<UserDTO[]> {
    return await this.userService.findAllAndPopulate();
  }

  @Get(':name')
  async getUserByName(@Param('name') name: string): Promise<UserDTO> {
    return await this.userService.findByNameAndPopulate(name)
  }

  @UseFilters(ValidationExceptionsFilter)
  @Post()
  async create(@Body() user: User) {
    await this.userService.create(user);
    return 'CREATED';
  }

  @UseFilters(ValidationExceptionsFilter)
  @Put(':name')
  async update(@Param('name') name: string, @Body() newUser: User) {
    await this.userService.updateByName(name, newUser);
    return 'UPDATED';
  }

  @UseFilters(ValidationExceptionsFilter)
  @Delete(':name')
  async remove(@Param('name') name: string) {
    await this.userService.removeByName(name);
    return 'DELETED'
  }
}