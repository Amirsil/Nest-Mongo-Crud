import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { TypegooseModule } from 'nestjs-typegoose';
import { AppController } from './app.controller';
import { CatsModule } from './cat/cat.module';
import { UserModule } from './user/user.module'
import { ValidationExceptionsFilter } from './utils/validationExceptionsFilter';
@Module({
  imports: [TypegooseModule.forRoot('mongodb://localhost:27017/nest', {
  }),
    CatsModule,
    UserModule
  ],
  providers: [{
    provide: APP_FILTER,
    useClass: ValidationExceptionsFilter
  }],
  controllers: [AppController]
})
export class AppModule { }
