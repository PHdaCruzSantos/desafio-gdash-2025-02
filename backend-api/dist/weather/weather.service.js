"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const weather_entity_1 = require("./entities/weather.entity");
const json2csv_1 = require("json2csv");
let WeatherService = class WeatherService {
    weatherModel;
    constructor(weatherModel) {
        this.weatherModel = weatherModel;
    }
    async create(createWeatherDto) {
        const createdLog = new this.weatherModel(createWeatherDto);
        return createdLog.save();
    }
    async findAll() {
        return this.weatherModel.find().sort({ createdAt: -1 }).limit(100).exec();
    }
    findOne(id) {
        return `This action returns a #${id} weather`;
    }
    update(id, updateWeatherDto) {
        return `This action updates a #${id} weather`;
    }
    remove(id) {
        return `This action removes a #${id} weather`;
    }
    async generateCSV() {
        const logs = await this.weatherModel
            .find()
            .sort({ createdAt: -1 })
            .limit(100)
            .lean()
            .exec();
        if (!logs || logs.length === 0)
            return '';
        const fields = [
            { label: 'Cidade', value: 'city' },
            { label: 'Temperatura (°C)', value: 'temp' },
            { label: 'Sensação (°C)', value: 'feels_like' },
            { label: 'Umildade (%)', value: 'humidity' },
            { label: 'Condição', value: 'description' },
            {
                label: 'Coletado em',
                value: (row) => row.collected_at
                    ? new Date(row.collected_at * 1000).toLocaleString('pt-BR')
                    : '',
            },
        ];
        console.table(fields);
        const json2csvParser = new json2csv_1.Parser({ fields });
        const csv = json2csvParser.parse(logs);
        return csv;
    }
};
exports.WeatherService = WeatherService;
exports.WeatherService = WeatherService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(weather_entity_1.WeatherLog.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], WeatherService);
//# sourceMappingURL=weather.service.js.map