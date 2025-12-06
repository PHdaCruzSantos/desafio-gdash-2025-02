import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateWeatherDto } from './dto/create-weather.dto';
import { WeatherLog } from './entities/weather.entity';
import { InsightService } from './insight.service';
import {AnalysisRequestDto} from "./dto/analysis-request.dto"
import axios from 'axios';

@Injectable()
export class WeatherService {
  constructor(
    @InjectModel(WeatherLog.name) private weatherModel: Model<WeatherLog>,
    private insightService: InsightService,
  ) {}

  async requestAnalysis(dto: AnalysisRequestDto) {
    const latestLog = await this.weatherModel.findOne().sort({ createdAt: -1 }).lean().exec();
    
    if (!latestLog) {
      return { insight: "Sem dados suficientes para análise." };
    }

    const cityName = dto.city || latestLog.city;
    const historyText = await this.getHourlyHistory(cityName);
    const currentText = `Temp: ${latestLog.temp}°C | Umid: ${latestLog.humidity}% | ${latestLog.description}`;

    const insight = await this.insightService.generateAnalysis(
      cityName,
      currentText,
      historyText,
      dto.context
    );

    return { 
      insight, 
      context: dto.context, 
      generated_at: new Date() 
    };
  }

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
    const createdLog = new this.weatherModel(createWeatherDto);
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
  async searchCities(query: string) {
    if (!query || query.length < 3) return [];
    
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const limit = 5;
    // API de Geocoding do OpenWeather
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=${limit}&appid=${apiKey}`;

    try {
      const response = await axios.get(url);
      // Formata para retornar apenas o necessário
      return response.data.map((item: any) => ({
        name: item.name,
        state: item.state,
        country: item.country,
        lat: item.lat,
        lon: item.lon,
        // Cria um label bonito: "Belo Horizonte, Minas Gerais, BR"
        label: `${item.name}${item.state ? `, ${item.state}` : ''}, ${item.country}`
      }));
    } catch (error) {
      return [];
    }
  }
  
  async getCurrentWeatherForCity(city: string) {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pt_br`;
    
    try {
      const response = await axios.get(url);
      return {
        temp: response.data.main.temp,
        description: response.data.weather[0].description,
        main: response.data.weather[0].main, // Rain, Clouds, Clear
        weather: response.data.weather,
        wind: response.data.wind,
        sys: response.data.sys,
      };
    } catch (error) {
      throw new Error('Cidade não encontrada');
    }
  }

  findOne(id: number) { return `This action returns a #${id} weather`; }
  update(id: number, updateWeatherDto: any) { return `This action updates a #${id} weather`; }
  remove(id: number) { return `This action removes a #${id} weather`; }
}