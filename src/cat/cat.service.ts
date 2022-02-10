import { ForbiddenException, Injectable } from "@nestjs/common";
import { ReturnModelType } from "@typegoose/typegoose";
import { InjectModel } from "nestjs-typegoose";
import { Cat } from "src/cat/cat.model";

@Injectable()
export class CatService {
  constructor(
    @InjectModel(Cat) private readonly catModel: ReturnModelType<typeof Cat>
  ) {}

  async findAll(): Promise<Cat[] | null> {
    return await this.catModel.find().exec();
  }

  async findByName(name: string): Promise<Cat> {
    return await this.catModel.findOne({ name });
  }

  async create(cat: Cat): Promise<Cat> {
    await this.validateNoDuplicates(cat.name);

    return await this.catModel.create(cat);
  }

  async updateByName(name: string, newCat: Cat): Promise<Cat> {
    await this.validateCatExists(name);

    return await this.catModel.findOneAndUpdate({ name }, newCat);
  }
  
  async removeByName(name: string): Promise<Cat> {
    await this.validateCatExists(name);

    return await this.catModel.findOneAndDelete({ name });
  }

  private async validateCatExists(name: string) {
    if ((await this.findByName(name)) == null) {
      throw new ForbiddenException(`A cat named ${name} doesn't exist`);
    }
  }

  private async validateNoDuplicates(name: string) {
    if ((await this.findByName(name))) {
      throw new ForbiddenException(`A cat named ${name} already exists`);
    }
  }

}