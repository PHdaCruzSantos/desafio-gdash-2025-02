import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; 
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { WeatherLog, WeatherLogSchema } from './entities/weather.entity';
import { InsightService } from './insight.service';
import { ExportService } from './export.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WeatherLog.name, schema: WeatherLogSchema },
    ]),
  ],
  controllers: [WeatherController],
  providers: [WeatherService, InsightService, ExportService],
})
export class WeatherModule {}
