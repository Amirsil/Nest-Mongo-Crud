import { Injectable, NotFoundException } from "@nestjs/common";
import { ReturnModelType } from "@typegoose/typegoose";
import { InjectModel } from "nestjs-typegoose";
import { Cat } from "src/cat/cat.model";
import { BaseService } from "src/utils/base.service";
import { CatDTO } from "./cat.dto";

@Injectable()
export class CatService extends BaseService<Cat, CatDTO> {
  constructor(
    @InjectModel(Cat)
    private readonly catModel: ReturnModelType<typeof Cat>) { super() }

  async findAll(): Promise<Cat[] | null> {
    return await (await this.catModel
      .find()
      .exec())
      .map((cat) => cat.toJSON());
  }

  async findByName(name: string): Promise<Cat> {
    const cat = await this.catModel.findOne({ name });

    if (!cat) {
      throw new NotFoundException(`Cat ${name} not found`);
    }

    return cat.toJSON();
  }

  async findByNames(names: string[]): Promise<Cat[] | null> {
    const cats = await this.catModel.find({ name: { $in: names } });

    const catNames = cats.map(({ name }) => name);
    names.forEach(catName => {
      if (!catNames.includes(catName)) {
        throw new NotFoundException(`Cat ${catName} not found`);
      }
    })

    return cats;
  }

  async create(catDTO: CatDTO): Promise<Cat> {
    await super.validateNoDuplicates(catDTO.name);
    return await this.catModel.create(catDTO);
  }

  async updateByName(name: string, catDTO: CatDTO): Promise<Cat> {
    await super.validateExists(name);
    return await this.catModel.findOneAndUpdate({ name }, catDTO);
  }

  async removeByName(name: string): Promise<Cat> {
    await super.validateExists(name);
    return await this.catModel.findOneAndDelete({ name });
  }
}