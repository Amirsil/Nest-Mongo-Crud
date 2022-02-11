import { Injectable } from "@nestjs/common";
import { ReturnModelType } from "@typegoose/typegoose";
import { InjectModel } from "nestjs-typegoose";
import { BaseModel } from "./base.model";

@Injectable()
export abstract class BaseService<T> {
    constructor(
        @InjectModel(BaseModel) private readonly model: ReturnModelType<typeof BaseModel>
      ) {}

    
}