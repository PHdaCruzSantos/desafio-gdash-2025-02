import { Model } from 'mongoose';
import { CreateWeatherDto } from './dto/create-weather.dto';
import { WeatherLog } from './entities/weather.entity';
import { InsightService } from './insight.service';
export declare class WeatherService {
    private weatherModel;
    private insightService;
    constructor(weatherModel: Model<WeatherLog>, insightService: InsightService);
    private getHourlyHistory;
    create(createWeatherDto: CreateWeatherDto): Promise<import("mongoose").Document<unknown, {}, WeatherLog, {}, {}> & WeatherLog & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, WeatherLog, {}, {}> & WeatherLog & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    generateCSV(): Promise<any>;
    findOne(id: number): string;
    update(id: number, updateWeatherDto: any): string;
    remove(id: number): string;
}
