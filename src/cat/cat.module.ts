import { Module } from "@nestjs/common";
import { TypegooseModule } from "nestjs-typegoose";
import { Cat } from "./cat.model";
import { CatController } from "./cat.controller";
import { CatService } from "./cat.service";

@Module({
  imports: [TypegooseModule.forFeature([Cat])],
  controllers: [CatController],
  providers: [CatService],
  exports: [CatService]
})
export class CatsModule {}