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
exports.WeatherController = void 0;
const common_1 = require("@nestjs/common");
const weather_service_1 = require("./weather.service");
const create_weather_dto_1 = require("./dto/create-weather.dto");
const update_weather_dto_1 = require("./dto/update-weather.dto");
const export_service_1 = require("./export.service");
const swagger_1 = require("@nestjs/swagger");
const analysis_request_dto_1 = require("./dto/analysis-request.dto");
let WeatherController = class WeatherController {
    weatherService;
    exportService;
    constructor(weatherService, exportService) {
        this.weatherService = weatherService;
        this.exportService = exportService;
    }
    create(createWeatherDto) {
        return this.weatherService.create(createWeatherDto);
    }
    async exportCsv(res) {
        try {
            const data = await this.weatherService.findAllForExport();
            if (!data) {
                return res.status(401).json({ message: 'CTLR: sem dados' });
            }
            const csvData = await this.exportService.generateCsv(data);
            if (!csvData) {
                return res.status(401).json({ message: 'CTLR: CSV Error na conversão' });
            }
            res.set({
                'Content-Type': 'text/csv',
                'Content-Disposition': 'attachment; filename="clima_exports.csv"',
            });
            res.send(csvData);
        }
        catch (erro) {
            res.status(500).json({
                message: 'Erro interno.',
                error: erro instanceof Error ? erro.message : String(erro),
            });
        }
    }
    async exportXlsx(res) {
        try {
            const data = await this.weatherService.findAllForExport();
            if (!data) {
                return res.status(401).json({ message: 'CTLR: sem dados' });
            }
            const bufferExcel = await this.exportService.generateXlsx(data);
            if (!bufferExcel) {
                return res.status(401).json({ message: 'CTLR: CSV Error na conversão' });
            }
            res.set({
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': 'attachment; filename="clima_exports.xlsx"',
                'Content-Length': bufferExcel.byteLength.toString(),
            });
            res.send(bufferExcel);
        }
        catch (erro) {
            res.status(500).json({
                message: 'Erro interno.',
                error: erro instanceof Error ? erro.message : String(erro),
            });
        }
    }
    async generateAnalysis(dto) {
        return this.weatherService.requestAnalysis(dto);
    }
    findAll() {
        return this.weatherService.findAll();
    }
    findOne(id) {
        return this.weatherService.findOne(+id);
    }
    update(id, updateWeatherDto) {
        return this.weatherService.update(+id, updateWeatherDto);
    }
    remove(id) {
        return this.weatherService.remove(+id);
    }
};
exports.WeatherController = WeatherController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Recebe dados do Worker e salva no banco' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Log climático criado com sucesso.' }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_weather_dto_1.CreateWeatherDto]),
    __metadata("design:returntype", void 0)
], WeatherController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('export/csv'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WeatherController.prototype, "exportCsv", null);
__decorate([
    (0, common_1.Get)('export/xlsx'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WeatherController.prototype, "exportXlsx", null);
__decorate([
    (0, common_1.Post)('analysis'),
    (0, swagger_1.ApiOperation)({ summary: 'Gera um insight de IA sob demanda' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [analysis_request_dto_1.AnalysisRequestDto]),
    __metadata("design:returntype", Promise)
], WeatherController.prototype, "generateAnalysis", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Lista os últimos 100 registros' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WeatherController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WeatherController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_weather_dto_1.UpdateWeatherDto]),
    __metadata("design:returntype", void 0)
], WeatherController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WeatherController.prototype, "remove", null);
exports.WeatherController = WeatherController = __decorate([
    (0, swagger_1.ApiTags)('weather'),
    (0, common_1.Controller)('weather'),
    __metadata("design:paramtypes", [weather_service_1.WeatherService,
        export_service_1.ExportService])
], WeatherController);
//# sourceMappingURL=weather.controller.js.map