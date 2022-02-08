import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypegooseModule } from 'nestjs-typegoose';
import { CatsModule } from './cat/cat.module';
import { UserModule } from './user/user.module'
@Module({
  imports: [TypegooseModule.forRoot('mongodb://192.168.77.149:27017/nest', {
  }),
  CatsModule,
  UserModule
],
})
export class AppModule {}
