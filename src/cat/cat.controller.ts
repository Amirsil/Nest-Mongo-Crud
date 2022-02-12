import { Controller, Get, Post, Body, Param, Put, Delete, UseFilters, NotFoundException } from "@nestjs/common";
import { Cat } from "./cat.model";
import { CatService } from "./cat.service";
import { ValidationExceptionsFilter } from "src/utils/validationExceptionsFilter";
import { CatDTO, CreateCatDTO } from "./cat.dto";
import { ApiResponse } from "@nestjs/swagger";

@Controller('cats')
export class CatController {
  constructor(private readonly catService: CatService) { }

  @ApiResponse({ type: [CatDTO] })
  @Get()
  async getCats(): Promise<Cat[]> {
    return await this.catService.findAll();
  }

  @ApiResponse({ type: CatDTO })
  @Get(':name')
  async getCatByName(@Param('name') name: string): Promise<Cat> {
    return await this.catService.findByName(name)
  }

  @UseFilters(ValidationExceptionsFilter)
  @Post()
  async create(@Body() createCatDTO: CreateCatDTO) {
    await this.catService.create(createCatDTO);
    return 'CREATED';
  }

  @UseFilters(ValidationExceptionsFilter)
  @Put(':name')
  async update(@Param('name') name: string, @Body() newCreateCatDTO: CreateCatDTO) {
    await this.catService.updateByName(name, newCreateCatDTO);
    return 'UPDATED';
  }

  @UseFilters(ValidationExceptionsFilter)
  @Delete(':name')
  async remove(@Param('name') name: string) {
    await this.catService.removeByName(name);
    return 'DELETED';
  }


}