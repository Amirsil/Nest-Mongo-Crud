import { Controller, Get, Post, Body, Put, Param, Delete, UseFilters } from '@nestjs/common';
import { User } from './user.model';
import { UserService } from './user.service';
import { ValidationExceptionsFilter } from 'src/utils/validationExceptionsFilter';
import { UserDTO } from './user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  async getUsers(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Get(':name')
  async getUserByName(@Param('name') name: string): Promise<User> {
    return await this.userService.findByName(name)
  }

  @UseFilters(ValidationExceptionsFilter)
  @Post()
  async create(@Body() userDTO: UserDTO) {
    await this.userService.create(userDTO);
    return 'CREATED';
  }

  @UseFilters(ValidationExceptionsFilter)
  @Put(':name')
  async update(@Param('name') name: string, @Body() newUserDTO: UserDTO) {
    await this.userService.updateByName(name, newUserDTO);
    return 'UPDATED';
  }

  @UseFilters(ValidationExceptionsFilter)
  @Delete(':name')
  async remove(@Param('name') name: string) {
    await this.userService.removeByName(name);
    return 'DELETED'
  }
}