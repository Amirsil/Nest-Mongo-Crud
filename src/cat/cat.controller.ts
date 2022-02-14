import { Controller, Get, Post, Body, Param, Put, Delete, UseFilters, NotFoundException, UseInterceptors, UploadedFile } from "@nestjs/common";
import { Cat } from "./cat.model";
import { CatService } from "./cat.service";
import { ValidationExceptionsFilter } from "src/utils/validation.exceptionfilter";
import { CatDTO, CreateCatDTO } from "./cat.dto";
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from "@nestjs/swagger";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { readFileSync, writeFileSync } from 'fs';
@ApiTags('Cats')
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

  @ApiResponse({ type: [CatDTO] })
  @Get('names/:names')
  async getCatsByNames(@Param('names') names: string[]): Promise<Cat[]> {
    return await this.catService.findByNames(String(names).split(','));
  }

  @ApiResponse({ type: CatDTO })
  @UseFilters(ValidationExceptionsFilter)
  @ApiConsumes('multipart/form-data')
  @Post()
  async createCat(@Body() createCatDTO: CreateCatDTO): Promise<Cat> {
    return await this.catService.create(createCatDTO);
  }

  @ApiResponse({ type: CatDTO })
  @UseFilters(ValidationExceptionsFilter)
  @Put(':name')
  async updateCatByName(@Param('name') name: string, @Body() newCreateCatDTO: CreateCatDTO): Promise<Cat> {
    return await this.catService.updateByName(name, newCreateCatDTO);
  }

  @UseFilters(ValidationExceptionsFilter)
  @Delete(':name')
  async removeCatByName(@Param('name') name: string) {
    await this.catService.removeByName(name);
    return 'OK';
  }

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        filename: { type: 'string' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({ destination: './uploads' })
  }))
  uploadFile2(@UploadedFile('file') file: Express.Multer.File) {
    return readFileSync(`./uploads/${file.filename}`).toString()
  }
}