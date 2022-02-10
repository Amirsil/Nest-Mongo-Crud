import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { User } from './user.model';
import { ReturnModelType } from '@typegoose/typegoose';
import { CatService } from 'src/cat/cat.service';
import { CatsModule } from 'src/cat/cat.module';
import { ValidationError } from 'class-validator';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userModel: ReturnModelType<typeof User>,
    private readonly catService: CatService
  ) { }

  async findAll(): Promise<User[] | null> {
    return await this.userModel.find().exec();
  }

  async findByName(name: string): Promise<User> {
    return await this.userModel.findOne({ name })
  }


  async create(user: User): Promise<User> {
    await this.validateCatsExistForUser(user);
    await this.validateNoDuplicates(user.name);

    return await this.userModel.create(user);
  }

  async updateByName(name: string, newUser: User): Promise<User> {
    await this.validateCatsExistForUser(newUser);
    await this.validateUserExists(name);

    return await this.userModel.findOneAndUpdate({ name }, newUser);
  }

  async removeByName(name: string): Promise<User> {
    return await this.userModel.findOneAndRemove({ name });
  }

  private async validateUserExists(name: string) {
    if ((await this.findByName(name)) == null) {
      throw new ForbiddenException(`A user named ${name} doesn't exist`);
    }
  }

  private async validateNoDuplicates(name: string) {
    if ((await this.findByName(name))) {
      throw new ForbiddenException(`A user named ${name} already exists`);
    }
  }

  private async validateCatsExistForUser(user: User) {
    const cats = await Promise.all(
      user.cats.map(async ({ name }) => ({
        name,
        body: await this.catService.findByName(name)
      })));

    cats.forEach((cat) => {
      if (cat.body === null) {
        throw new ForbiddenException(`A cat named ${cat.name} doesn't exist`);
      }
    });
  }
}
