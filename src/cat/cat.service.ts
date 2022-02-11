import { ForbiddenException, forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ReturnModelType } from "@typegoose/typegoose";
import { InjectModel } from "nestjs-typegoose";
import { Cat } from "src/cat/cat.model";
import { UserService } from "src/user/user.service";

@Injectable()
export class CatService {
  constructor(
    @InjectModel(Cat) private readonly catModel: ReturnModelType<typeof Cat>,
    @Inject(forwardRef(() => UserService)) private readonly userService: UserService
  ) { }

  async findAll(): Promise<Cat[] | null> {
    return await (await this.catModel
      .find()
      .exec())
      .map((cat) => cat.toJSON());
  }

  async findByName(name: string): Promise<Cat> {
    const cat = await this.catModel.findOne({ name });
    if (!cat) {
      throw new NotFoundException(`Cat ${name} not found`, name);
    }
    return cat.toJSON();
  }

  async findByNames(names: string[]): Promise<Cat[] | null> {
    return await Promise.all(names.map(
      (name) => this.findByName(name)));
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
    await this.userService.removeCatFromUsers(name);
    return await this.catModel.findOneAndDelete({ name });
  }

  private async validateCatExists(name: string) {
    try {
      await this.findByName(name)
    } catch(err) {
      throw new ForbiddenException(`A cat named ${name} doesn't exist`);
    }
  }

  private async validateNoDuplicates(name: string) {
    try {
      await this.findByName(name)
    } catch(err) {
      return
    }
    throw new ForbiddenException(`A cat named ${name} already exists`);
  }

}