import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateWeatherDto } from './dto/create-weather.dto';
import { WeatherLog } from './entities/weather.entity';
import { Parser } from 'json2csv';

@Injectable()
export class WeatherService {
  constructor(
    @InjectModel(WeatherLog.name) private weatherModel: Model<WeatherLog>,
  ) {}

  async create(createWeatherDto: CreateWeatherDto) {
    const createdLog = new this.weatherModel(createWeatherDto);

    return createdLog.save();
  }

  async findAll() {
    return this.weatherModel.find().sort({ createdAt: -1 }).limit(100).exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} weather`;
  }

  update(id: number, updateWeatherDto: any) {
    return `This action updates a #${id} weather`;
  }

  remove(id: number) {
    return `This action removes a #${id} weather`;
  }

  async generateCSV() {
    const logs = await this.weatherModel
      .find()
      .sort({ createdAt: -1 })
      .limit(100)
      .lean()
      .exec();

    if (!logs || logs.length === 0) return '';

    const fields = [
      { label: 'Cidade', value: 'city' },
      { label: 'Temperatura (°C)', value: 'temp' },
      { label: 'Sensação (°C)', value: 'feels_like' },
      { label: 'Umildade (%)', value: 'humidity' },
      { label: 'Condição', value: 'description' },
      {
        label: 'Coletado em',
        value: (row: WeatherLog) =>
          row.collected_at
            ? new Date(row.collected_at * 1000).toLocaleString('pt-BR')
            : '',
      },
    ];
    console.table(fields);
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(logs);

    return csv;
  }
}
