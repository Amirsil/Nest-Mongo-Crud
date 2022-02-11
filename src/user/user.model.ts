import { modelOptions, prop, Ref } from '@typegoose/typegoose';
import { Cat } from 'src/cat/cat.model';


export class User {
  _id?: string;
  
  @prop({ required: true, unique: true })
  name: string;

  @prop({ default: [], ref: () => Cat })
  cats: Ref<Cat>[];
}
