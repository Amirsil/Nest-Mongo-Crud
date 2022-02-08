import { Controller, Get, Post, Body } from "@nestjs/common";
import { Cat } from "./cat.model";
import { Crud } from 'nestjs-mongoose-crud';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';

@Crud({
    model: Cat
})

@Controller("cats")
export class CatsController {
  constructor(@InjectModel(Cat) public model: ModelType<Cat>) {}
}
