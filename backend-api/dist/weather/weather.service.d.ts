import { Model } from 'mongoose';
import { CreateWeatherDto } from './dto/create-weather.dto';
import { WeatherLog } from './entities/weather.entity';
import { InsightService } from './insight.service';
import { AnalysisRequestDto, AnalysisContext } from "./dto/analysis-request.dto";
export declare class WeatherService {
    private weatherModel;
    private insightService;
    constructor(weatherModel: Model<WeatherLog>, insightService: InsightService);
    requestAnalysis(dto: AnalysisRequestDto): Promise<{
        insight: string;
        context?: undefined;
        generated_at?: undefined;
    } | {
        insight: string;
        context: AnalysisContext;
        generated_at: Date;
    }>;
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
    findAllForExport(): Promise<(import("mongoose").FlattenMaps<{
        city: string;
        temp: number;
        feels_like: number;
        humidity: number;
        pressure: number;
        description: string;
        wind_speed: number;
        collected_at: number;
    }> & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    findOne(id: number): string;
    update(id: number, updateWeatherDto: any): string;
    remove(id: number): string;
}
