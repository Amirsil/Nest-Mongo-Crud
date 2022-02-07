import { prop, Ref } from '@typegoose/typegoose';

export class User {
  @prop({ required: true })
  public name: string;

  // @prop({ required: true, type: Cat })
  // public cats: Ref<Cat>;
}
