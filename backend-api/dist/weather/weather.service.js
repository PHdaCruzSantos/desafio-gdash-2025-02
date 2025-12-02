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
const insight_service_1 = require("./insight.service");
let WeatherService = class WeatherService {
    weatherModel;
    insightService;
    constructor(weatherModel, insightService) {
        this.weatherModel = weatherModel;
        this.insightService = insightService;
    }
    async requestAnalysis(dto) {
        const latestLog = await this.weatherModel.findOne().sort({ createdAt: -1 }).lean().exec();
        if (!latestLog) {
            return { insight: "Sem dados suficientes para análise." };
        }
        const cityName = dto.city || latestLog.city;
        const historyText = await this.getHourlyHistory(cityName);
        const currentText = `Temp: ${latestLog.temp}°C | Umid: ${latestLog.humidity}% | ${latestLog.description}`;
        const insight = await this.insightService.generateAnalysis(cityName, currentText, historyText, dto.context);
        return {
            insight,
            context: dto.context,
            generated_at: new Date()
        };
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