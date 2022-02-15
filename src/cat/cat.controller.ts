import { Controller, Get, Post, Body, Param, Put, Delete, UseFilters, NotFoundException, UseInterceptors, UploadedFile, Res } from "@nestjs/common";
import { Cat } from "./cat.model";
import { CatService } from "./cat.service";
import { ValidationExceptionsFilter } from "src/utils/validation.exceptionfilter";
import { CatDTO, CreateCatDTO, UploadCatSchema } from "./cat.dto";
import { ApiBadRequestResponse, ApiBody, ApiConsumes, ApiResponse, ApiTags, getSchemaPath } from "@nestjs/swagger";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { readFileSync, writeFileSync } from 'fs';
import { FilesService, GridFsStorageConfig } from "src/files/file.service";
@ApiTags('Cats')
@Controller('cats')
export class CatController {
  constructor(
    private readonly catService: CatService,
    private readonly fileService: FilesService) { }

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

  @Get(':name/image')
  async getCatImage(@Param('name') name: string, @Res() res) {
    return this.catService.getCatImage(name, res);
  }

  @ApiResponse({ type: [CatDTO] })
  @Get('names/:names')
  async getCatsByNames(@Param('names') names: string[]): Promise<Cat[]> {
    return await this.catService.findByNames(String(names).split(','));
  }

  @ApiResponse({ type: CatDTO })
  @UseFilters(ValidationExceptionsFilter)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', new GridFsStorageConfig().createMulterOptions()))
  @ApiBody(UploadCatSchema)
  @Post()
  async createCat(@Body() body, @UploadedFile('file') image: Express.Multer.File): Promise<Cat> {
    const createCatDTO: CreateCatDTO = {
      ...JSON.parse(body.cat)
      , image: image?.id
    };
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
}