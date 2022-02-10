import { ApiProperty, ApiPropertyOptional, getSchemaPath } from '@nestjs/swagger';
import { modelOptions, prop } from '@typegoose/typegoose';
import { Cat } from '../cat/cat.model';
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
export class User {
  @prop({ required: true })
  @ApiProperty()
  public name: string;

  @prop({ default: [] })
  @ApiProperty({
    type: 'array',
    items: {
      $ref: getSchemaPath(Cat)
    }
  })
  public cats: Cat[];
}
