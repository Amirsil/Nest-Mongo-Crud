import { Controller, Get, Post, Body } from '@nestjs/common';
import { User } from './user.model';
import { Crud } from 'nestjs-mongoose-crud';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';

@Crud({
  model: User
})

@Controller('users')
export class UserController {
  constructor(@InjectModel(User) public model: ModelType<User>) {}
}
