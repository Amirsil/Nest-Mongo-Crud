import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { User } from './user.model';
import { ReturnModelType } from '@typegoose/typegoose';
import { CatService } from 'src/cat/cat.service';
import { CreateUserDTO } from './user.dto';
import { Cat } from 'src/cat/cat.model';
import { BaseService } from 'src/utils/base.service';

@Injectable()
export class UserService extends BaseService<User, CreateUserDTO> {
  constructor(
    @InjectModel(User) private readonly userModel: ReturnModelType<typeof User>,
    @Inject(forwardRef(() => CatService)) private readonly catService: CatService
  ) { super() }


  async findAll(): Promise<User[]> {
    return await this.userModel
      .find()
      .populate({ path: 'cats', model: Cat })
      .exec();
  }

  async findByName(name: string): Promise<User> {
    const user = await this.userModel
      .findOne({ name })
      .populate({ path: 'cats', model: Cat })
      .exec();

    if (!user) {
      throw new NotFoundException(`User ${name} not found`, name);
    }

    return user;
  }

  async findByNames(names: string[]): Promise<User[]> {
    const users = await this.userModel
      .find({ name: { $in: names } })
      .populate({ path: 'cats', model: Cat })
      .exec();

    const userNames = users.map(({ name }) => name);
    names.forEach(userName => {
      if (!userNames.includes(userName)) {
        throw new NotFoundException(`User ${userName} not found`);
      }
    })

    return users;
  }

  async create(createUserDTO: CreateUserDTO): Promise<User> {
    await super.validateNameIsLegal(createUserDTO.name);
    await super.validateNoDuplicates(createUserDTO.name);

    const user = await this.createUserFromDTO(createUserDTO);
    return (await this.userModel
      .create(user))
      .populate('cats');
  }

  async updateByName(name: string, createUserDTO: CreateUserDTO): Promise<User> {
    await super.validateNameIsLegal(createUserDTO.name);
    await super.validateExists(name);

    const newUser = await this.createUserFromDTO(createUserDTO);
    return await this.userModel
      .findOneAndUpdate({ name }, newUser)
      .populate({ path: 'cats', model: Cat })
      .exec()
  }

  async removeByName(name: string): Promise<void> {
    await super.validateNameIsLegal(name);
    await super.validateExists(name);
    await this.userModel
      .findOneAndRemove({ name })
      .exec();
  }

  private async createUserFromDTO(createUserDTO: CreateUserDTO): Promise<User> {
    const cats = await this.catService.findByNames(createUserDTO.catNames);
    const user = {
      name: createUserDTO.name,
      cats: cats.map(({ _id }) => _id)
    }

    return user;
  }
}
