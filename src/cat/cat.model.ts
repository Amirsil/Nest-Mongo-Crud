import { prop } from "@typegoose/typegoose";

export class Cat {
  @prop({ required: true })
  name: string;
}
