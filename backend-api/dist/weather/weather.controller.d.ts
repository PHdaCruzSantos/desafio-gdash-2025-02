import { WeatherService } from './weather.service';
import { CreateWeatherDto } from './dto/create-weather.dto';
import { UpdateWeatherDto } from './dto/update-weather.dto';
import type { Response } from 'express';
import { ExportService } from './export.service';
export declare class WeatherController {
    private readonly weatherService;
    private readonly exportService;
    constructor(weatherService: WeatherService, exportService: ExportService);
    create(createWeatherDto: CreateWeatherDto): Promise<import("mongoose").Document<unknown, {}, import("./entities/weather.entity").WeatherLog, {}, {}> & import("./entities/weather.entity").WeatherLog & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    exportCsv(res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    exportXlsx(res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, import("./entities/weather.entity").WeatherLog, {}, {}> & import("./entities/weather.entity").WeatherLog & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    findOne(id: string): string;
    update(id: string, updateWeatherDto: UpdateWeatherDto): string;
    remove(id: string): string;
}
