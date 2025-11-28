import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type WeatherLogDocument = HydratedDocument<WeatherLog>;

@Schema({ timestamps: true })
export class WeatherLog {
  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  temp: number;

  @Prop()
  feels_like: number;

  @Prop()
  humidity: number;

  @Prop()
  pressure: number;

  @Prop()
  description: string;

  @Prop()
  wind_speed: number;

  // Importante: Data original da coleta (que veio do Python)
  @Prop()
  collected_at: number;
}

export const WeatherLogSchema = SchemaFactory.createForClass(WeatherLog);
