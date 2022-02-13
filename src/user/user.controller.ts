import { Controller, Get, Post, Body, Put, Param, Delete, UseFilters, HttpStatus } from '@nestjs/common';
import { User } from './user.model';
import { UserService } from './user.service';
import { ValidationExceptionsFilter } from 'src/utils/validation.exceptionfilter';
import { CreateUserDTO, UserDTO } from './user.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
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

  @ApiResponse({ type: [UserDTO] })
  @Get('names/:names')
  async getUsersByNames(@Param('names') names: string[]): Promise<User[]> {
    return await this.userService.findByNames(String(names).split(','));
  }

  @ApiResponse({ type: UserDTO })
  @UseFilters(ValidationExceptionsFilter)
  @Post()
  async createUser(@Body() createUserDTO: CreateUserDTO): Promise<User> {
    return await this.userService.create(createUserDTO);
  }

  @ApiResponse({ type: UserDTO })
  @UseFilters(ValidationExceptionsFilter)
  @Put(':name')
  async updateUserByName(@Param('name') name: string, @Body() newCreateUserDTO: CreateUserDTO): Promise<User> {
    return await this.userService.updateByName(name, newCreateUserDTO);
  }

  @UseFilters(ValidationExceptionsFilter)
  @Delete(':name')
  async removeUserByName(@Param('name') name: string): Promise<void> {
    await this.userService.removeByName(name);
  }
}
