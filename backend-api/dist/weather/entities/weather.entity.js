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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherLogSchema = exports.WeatherLog = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let WeatherLog = class WeatherLog {
    city;
    temp;
    feels_like;
    humidity;
    pressure;
    description;
    wind_speed;
    collected_at;
};
exports.WeatherLog = WeatherLog;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], WeatherLog.prototype, "city", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], WeatherLog.prototype, "temp", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], WeatherLog.prototype, "feels_like", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], WeatherLog.prototype, "humidity", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], WeatherLog.prototype, "pressure", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], WeatherLog.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], WeatherLog.prototype, "wind_speed", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], WeatherLog.prototype, "collected_at", void 0);
exports.WeatherLog = WeatherLog = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], WeatherLog);
exports.WeatherLogSchema = mongoose_1.SchemaFactory.createForClass(WeatherLog);
//# sourceMappingURL=weather.entity.js.map