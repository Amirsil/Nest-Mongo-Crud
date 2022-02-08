import { ApiProperty } from "@nestjs/swagger";
import { prop } from "@typegoose/typegoose";

export class Cat {
  @prop({ required: true })
  @ApiProperty()
  name: string;
}
