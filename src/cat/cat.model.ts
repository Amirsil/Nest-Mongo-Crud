import { ApiProperty } from "@nestjs/swagger";
import { modelOptions, prop } from "@typegoose/typegoose";
import { IsNotEmpty } from 'class-validator';
@modelOptions({
  schemaOptions: {
      toJSON: {
          transform: (doc, ret) => {
              delete ret.__v;
              delete ret._id;
          }
      }
  }
})
export class Cat {
  @prop({ required: true })
  @ApiProperty()
  name: string;
}
