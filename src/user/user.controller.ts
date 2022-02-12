import { Controller, Get, Post, Body, Put, Param, Delete, UseFilters } from '@nestjs/common';
import { User } from './user.model';
import { UserService } from './user.service';
import { ValidationExceptionsFilter } from 'src/utils/validationExceptionsFilter';
import { CreateUserDTO, UserDTO } from './user.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }
  
  @ApiResponse({ type: [UserDTO] })
  @Get()
  async getUsers(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @ApiResponse({ type: UserDTO })
  @Get(':name')
  async getUserByName(@Param('name') name: string): Promise<User> {
    return await this.userService.findByName(name)
  }

  @UseFilters(ValidationExceptionsFilter)
  @Post()
  async create(@Body() createUserDTO: CreateUserDTO) {
    await this.userService.create(createUserDTO);
    return 'CREATED';
  }

  @UseFilters(ValidationExceptionsFilter)
  @Put(':name')
  async update(@Param('name') name: string, @Body() newCreateUserDTO: CreateUserDTO) {
    await this.userService.updateByName(name, newCreateUserDTO);
    return 'UPDATED';
  }

  @UseFilters(ValidationExceptionsFilter)
  @Delete(':name')
  async remove(@Param('name') name: string) {
    await this.userService.removeByName(name);
    return 'DELETED'
  }
}