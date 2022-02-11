import { Controller, Get, Post, Body, Param, Put, Delete, UseFilters } from "@nestjs/common";
import { Cat } from "./cat.model";
import { CatService } from "./cat.service";
import { ValidationExceptionsFilter } from "src/utils/validationExceptionsFilter";
import { CatDTO } from "./cat.dto";

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
  async create(@Body() catDTO: CatDTO) {
    await this.catService.create(catDTO);
    return 'CREATED';
  }

  @UseFilters(ValidationExceptionsFilter)
  @Put(':name')
  async update(@Param('name') name: string, @Body() newCatDTO: CatDTO) {
    await this.catService.updateByName(name, newCatDTO);
    return 'UPDATED';
  }

  @UseFilters(ValidationExceptionsFilter)
  @Delete(':name')
  async remove(@Param('name') name: string) {
    await this.catService.removeByName(name);
    return 'DELETED';
  }
  
  
}