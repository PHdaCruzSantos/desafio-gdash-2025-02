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
const insight_service_1 = require("./insight.service");
let WeatherService = class WeatherService {
    weatherModel;
    insightService;
    constructor(weatherModel, insightService) {
        this.weatherModel = weatherModel;
        this.insightService = insightService;
    }
    async getHourlyHistory(city) {
        const historyPoints = [];
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
                historyPoints.push(`[-${index + 1}h | ${timeString}] Temp: ${log.temp}°C | Pressão: ${log.pressure || '?'}hPa`);
            }
        });
        return historyPoints.join('\n');
    }
    async create(createWeatherDto) {
        const historyText = await this.getHourlyHistory(createWeatherDto.city);
        const currentText = `Temp: ${createWeatherDto.temp}°C | Sensação: ${createWeatherDto.feels_like}°C | Umid: ${createWeatherDto.humidity}% | ${createWeatherDto.description}`;
        const insight = await this.insightService.generateWeatherAnalysis(createWeatherDto.city, currentText, historyText);
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
    async generateCSV() {
        const logs = await this.weatherModel.find().sort({ createdAt: -1 }).limit(100).lean().exec();
        if (!logs || logs.length === 0)
            return '';
        const fields = [
            { label: 'Cidade', value: 'city' },
            { label: 'Temp (C)', value: 'temp' },
            { label: 'Data', value: (row) => row.collected_at ? new Date(row.collected_at * 1000).toLocaleString('pt-BR') : '' },
            { label: 'Análise IA', value: 'ai_insight' }
        ];
        const json2csvParser = new json2csv_1.Parser({ fields });
        return json2csvParser.parse(logs);
    }
    findOne(id) { return `This action returns a #${id} weather`; }
    update(id, updateWeatherDto) { return `This action updates a #${id} weather`; }
    remove(id) { return `This action removes a #${id} weather`; }
};
exports.WeatherService = WeatherService;
exports.WeatherService = WeatherService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(weather_entity_1.WeatherLog.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        insight_service_1.InsightService])
], WeatherService);
//# sourceMappingURL=weather.service.js.map