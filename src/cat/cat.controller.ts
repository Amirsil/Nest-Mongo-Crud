import { Controller, Get, Post, Body, Param, Put, Delete, InternalServerErrorException, HttpException, ValidationError, HttpStatus, UseFilters, Res } from "@nestjs/common";
import { Cat } from "./cat.model";
import { Crud } from 'nestjs-mongoose-crud';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { CatService } from "./cat.service";
import { ValidationExceptionsFilter } from "src/utils/validationExceptionsFilter";

@Controller('cats')
export class CatController {
  constructor(private readonly catService: CatService) { }

  @Get()
  async getCats(): Promise<Cat[]> {
    return await this.catService.findAll();
  }

  @Get(':name')
  async getCatByName(@Param('name') name: string): Promise<Cat> {
    return await this.catService.findByName(name)
  }

  @UseFilters(ValidationExceptionsFilter)
  @Post()
  async create(@Body() cat: Cat) {
    await this.catService.create(cat);
    return 'CREATED';
  }

  @UseFilters(ValidationExceptionsFilter)
  @Put(':name')
  async update(@Param('name') name: string, @Body() newCat: Cat) {
    await this.catService.updateByName(name, newCat);
    return 'UPDATED';
  }

  @UseFilters(ValidationExceptionsFilter)
  @Delete(':name')
  async remove(@Param('name') name: string) {
    await this.catService.removeByName(name);
    return 'DELETED';
  }
  
  
}