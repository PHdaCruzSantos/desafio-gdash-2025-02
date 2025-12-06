import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true }) 
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  description: string;

  @Prop()
  photo: string;

  @Prop({ type: [{ id: Number, name: String, sprite: String, capturedAt: Date }] })
  pokemonCollection: { id: number; name: string; sprite: string; capturedAt: Date }[];

  @Prop()
  lastSpin: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);