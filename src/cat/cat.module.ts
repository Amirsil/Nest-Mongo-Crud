import { Module } from "@nestjs/common";
import { TypegooseModule } from "nestjs-typegoose";
import { Cat } from "./cat.model";
import { CatController } from "./cat.controller";
import { CatService } from "./cat.service";
import { UserModule } from "src/user/user.module";
import { UserService } from "src/user/user.service";
import { User } from "src/user/user.model";

@Module({
  imports: [TypegooseModule.forFeature([Cat]), TypegooseModule.forFeature([User])],
  controllers: [CatController],
  providers: [CatService, UserService],
  exports: [CatService]
})
export class CatsModule {}