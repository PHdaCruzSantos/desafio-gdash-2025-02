import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateWeatherDto {
  @IsString()
  @IsNotEmpty()
  city: string;

  @IsNumber()
  @IsNotEmpty()
  temp: number;

  @IsNumber()
  @IsOptional()
  feels_like?: number;

  @IsNumber()
  @IsOptional()
  humidity?: number;

  @IsNumber()
  @IsOptional()
  pressure?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  wind_speed?: number;

  @IsNumber()
  @IsOptional()
  collected_at?: number;
}
