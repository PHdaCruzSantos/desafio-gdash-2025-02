import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { WeatherService } from './weather.service';
import { CreateWeatherDto } from './dto/create-weather.dto';
import { UpdateWeatherDto } from './dto/update-weather.dto';
import type { Response } from 'express';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Post()
  create(@Body() createWeatherDto: CreateWeatherDto) {
    return this.weatherService.create(createWeatherDto);
  }

  @Get('/export/csv')
  async exportCsv(@Res() res: Response) {
    try {
      const csvData = await this.weatherService.generateCSV();

      if (!csvData) {
        return res.status(401).json({ message: 'CTLR: CSV Error' });
      }

      res.set({
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="clima_exports.csv"',
      });

      res.send(csvData);
    } catch (erro) {
      res.status(500).json({
        message: 'Erro interno.',
        error: erro instanceof Error ? erro.message : String(erro),
      });
    }
  }

  @Get()
  findAll() {
    return this.weatherService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.weatherService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWeatherDto: UpdateWeatherDto) {
    return this.weatherService.update(+id, updateWeatherDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.weatherService.remove(+id);
  }
}
