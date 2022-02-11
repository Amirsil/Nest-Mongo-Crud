import { ConsoleLogger, ForbiddenException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { User } from './user.model';
import { ReturnModelType } from '@typegoose/typegoose';
import { CatService } from 'src/cat/cat.service';
import { CatsModule } from 'src/cat/cat.module';
import { ValidationError } from 'class-validator';
import { Document, QueryWithHelpers } from 'mongoose';
import { UserDTO, convertUserToDTO } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userModel: ReturnModelType<typeof User>,
    @Inject(forwardRef(() => CatService)) private readonly catService: CatService
  ) { }

  async findAllAndPopulate(): Promise<UserDTO[] | null> {
    const users = await this.findAll();
    return await Promise.all(users.map(
      async (user) => await convertUserToDTO(user, this.catService)));
  }

  async findAll(): Promise<User[] | null> {

    return (await this.userModel
      .find()
      .exec())
      .map((user) => user.toJSON());
  }

  async findByName(name: string): Promise<User> {
    const user = await this.userModel.findOne({ name });
    if (!user) {
      throw new NotFoundException(`User ${name} not found`, name);
    }
    return user.toJSON();
  }

  async findByNames(names: string[]): Promise<User[] | null> {
    return await Promise.all(names.map(
      (name) => this.findByName(name)));
  }

  async findByNameAndPopulate(name: string) {
    const user = await this.findByName(name);
    return await convertUserToDTO(user, this.catService);
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

  async removeCatFromUsers(catName: string) {
    await this.userModel.updateMany({}, { $pull: { catNames: catName } })
  }

  private async validateUserExists(name: string) {
    try {
      await this.findByName(name)
    } catch (err) {
      throw new ForbiddenException(`A user named ${name} doesn't exist`);
    }
  }

  private async validateNoDuplicates(name: string) {
    try {
      console.log(await this.findByName(name))
    } catch (err) {
      return
    }
    throw new ForbiddenException(`A user named ${name} already exists`);
  }

  private async validateCatsExistForUser(user: User) {
    try {
      await Promise.all(
        user.catNames.map(
          name => this.catService.findByName(name)));
    } catch (err) {
      throw new ForbiddenException(`A cat named ${err.response.error} doesn't exist`);
    }
  }
}
