import { ApiProperty } from "@nestjs/swagger";
import { modelOptions, prop } from "@typegoose/typegoose";

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
export class BaseModel {
    @prop({ required: true, unique: true })
    @ApiProperty()
    name: string;
}