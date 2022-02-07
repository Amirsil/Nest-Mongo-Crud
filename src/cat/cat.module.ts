import { Module } from "@nestjs/common";
import { TypegooseModule } from "nestjs-typegoose";
import { Cat } from "./cat.model";
import { CatsController } from "./cat.controller";

@Module({
  imports: [TypegooseModule.forFeature([Cat])],
  controllers: [CatsController],
})
export class CatsModule {}