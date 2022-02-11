import { ApiProperty, ApiPropertyOptional, getSchemaPath } from '@nestjs/swagger';
import { modelOptions, prop } from '@typegoose/typegoose';


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
export class User {
  @prop({ required: true, unique: true })
  @ApiProperty()
  public name: string;

  @prop({ default: []})
  @ApiProperty()
  public catNames: string[];
}
