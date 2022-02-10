import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { CatsModule } from 'src/cat/cat.module';
import { CatService } from 'src/cat/cat.service';
import { UserController } from './user.controller';
import { User } from './user.model';
import { UserService } from './user.service';

@Module({
  imports: [TypegooseModule.forFeature([User]), CatsModule],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
