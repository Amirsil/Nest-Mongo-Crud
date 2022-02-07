import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { CatsModule } from './cat/cat.module';
import { UserModule } from './user/user.module'
@Module({
  imports: [TypegooseModule.forRoot('mongodb://192.168.77.149:27017/nest', {
  }),
  CatsModule,
  UserModule
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
