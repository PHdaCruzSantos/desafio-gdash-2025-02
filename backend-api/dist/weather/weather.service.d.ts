import { Model } from 'mongoose';
import { CreateWeatherDto } from './dto/create-weather.dto';
import { WeatherLog } from './entities/weather.entity';
export declare class WeatherService {
    private weatherModel;
    constructor(weatherModel: Model<WeatherLog>);
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
    findOne(id: number): string;
    update(id: number, updateWeatherDto: any): string;
    remove(id: number): string;
    generateCSV(): Promise<any>;
}
