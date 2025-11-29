import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateWeatherDto } from './dto/create-weather.dto';
import { WeatherLog } from './entities/weather.entity';
import { Parser } from 'json2csv';
import { InsightService } from './insight.service';

@Injectable()
export class WeatherService {
  constructor(
    @InjectModel(WeatherLog.name) private weatherModel: Model<WeatherLog>,
    private insightService: InsightService,
  ) {}

  private async getHourlyHistory(city: string): Promise<string> {
    
    const historyPoints: string[] = [];
    const now = Math.floor(Date.now() / 1000);
    const oneHour = 3600;
    const timeOffsets = [1, 2, 3, 4, 5];

    const promises = timeOffsets.map(async (hoursAgo) => {
        const targetTime = now - (hoursAgo * oneHour);
        return this.weatherModel.findOne({
            city: city,
            collected_at: { $lte: targetTime }
        }).sort({ collected_at: -1 }).select('temp humidity pressure description collected_at').lean().exec();
    });

    const results = await Promise.all(promises);
    
    results.forEach((log, index) => {
        if (log) {
             const timeString = new Date(log.collected_at * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
             historyPoints.push(`[-${index+1}h | ${timeString}] Temp: ${log.temp}°C | Pressão: ${log.pressure || '?'}hPa`);
        }
    });
    return historyPoints.join('\n');
  }

  async create(createWeatherDto: CreateWeatherDto) {
    const historyText = await this.getHourlyHistory(createWeatherDto.city);
    const currentText = `Temp: ${createWeatherDto.temp}°C | Sensação: ${createWeatherDto.feels_like}°C | Umid: ${createWeatherDto.humidity}% | ${createWeatherDto.description}`;


    const insight = await this.insightService.generateWeatherAnalysis(
      createWeatherDto.city,
      currentText,
      historyText
    );

    const dataToSave = {
      ...createWeatherDto,
      ai_insight: insight,
    };

    const createdLog = new this.weatherModel(dataToSave);
    return createdLog.save();
  }

  async findAll() {
    return this.weatherModel.find().sort({ createdAt: -1 }).limit(100).exec();
  }
  
  async findAllForExport() {
    return this.weatherModel
      .find()
      .sort({ createdAt: -1 })
      .limit(100)
      .lean()
      .exec();
  }

  findOne(id: number) { return `This action returns a #${id} weather`; }
  update(id: number, updateWeatherDto: any) { return `This action updates a #${id} weather`; }
  remove(id: number) { return `This action removes a #${id} weather`; }
}