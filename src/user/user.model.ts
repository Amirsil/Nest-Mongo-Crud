import { ApiPreconditionFailedResponse, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { prop, Ref } from '@typegoose/typegoose';
import { Cat } from '../cat/cat.model';
export class User {
  @prop({ required: true })
  @ApiProperty()
  public name: string;

  @ApiProperty({
    type: 'array',
    items: {
      $ref: getSchemaPath(Cat)
    }
  })
  public cats: Cat[];
}
